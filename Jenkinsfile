// Path: Jenkinsfile

pipeline {
  agent any

  environment {
    DOCKER_REGISTRY        = 'docker.io'
    DOCKER_CREDENTIALS     = 'dockerhub-creds'      // your Jenkins ID for DockerHub creds
    OPENSHIFT_CREDENTIALS  = 'openshift-token'      // your Jenkins ID for OC token
    SONAR_ENABLED          = true                   // flip to false if you want to skip
    GIT_SHORT_SHA          = "${env.GIT_COMMIT?.substring(0,8)}"
    IMAGE_BACKEND          = "${DOCKER_REGISTRY}/soul808/vista-backend:${GIT_SHORT_SHA}"
    IMAGE_FRONTEND         = "${DOCKER_REGISTRY}/soul808/vista-frontend:${GIT_SHORT_SHA}"
    // Image retention settings
    IMAGE_RETENTION_COUNT  = '3'                    // Keep last N images
    IMAGE_RETENTION_DAYS   = '7'                    // Keep images newer than N days
    // SonarCloud settings
    SONAR_HOST_URL         = 'https://sonarcloud.io'
    SONAR_ORGANIZATION     = 'soul808'
    SONAR_PROJECT_KEY      = 'soul808_vista'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          userRemoteConfigs: [[
            url: 'https://github.com/your-org/your-repo.git',
            credentialsId: 'github-pat-2'
          ]]
        ])
      }
    }

    stage('Build & Test Backend') {
      agent {
        docker {
          image 'maven:3.9.6-eclipse-temurin-17'
          args  '-v $HOME/.m2:/root/.m2'
        }
      }
      steps {
        dir('apps/backend') {
          // run tests, generate Jacoco coverage report
          sh 'mvn clean test jacoco:report -B'
          // archive results so Sonar and Jenkins can read them
          junit '**/target/surefire-reports/*.xml'
          publishCoverage adapters: [jacocoAdapter('**/target/jacoco.exec')]
        }
      }
    }

    stage('Build & Test Frontend') {
      agent {
        docker {
          image 'node:18'
          args  '-u root'
        }
      }
      steps {
        dir('apps/frontend/shell') {
          // run Jest with coverage
          sh 'yarn install --frozen-lockfile'
          sh 'yarn test --ci --coverage'
          // archive results
          junit '**/coverage/junit-report.xml'
          publishCoverage adapters: [istanbulAdapter('coverage/coverage-final.json')]
        }
      }
    }

    stage('SonarQube Analysis') {
      when { expression { return SONAR_ENABLED } }
      steps {
        withSonarQubeEnv('SonarCloud') {
          withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
            sh """
              # Run backend analysis
              cd apps/backend
              mvn clean verify sonar:sonar \
                -Dsonar.host.url=${SONAR_HOST_URL} \
                -Dsonar.login=${SONAR_TOKEN} \
                -Dsonar.organization=${SONAR_ORGANIZATION} \
                -Dsonar.projectKey=${SONAR_PROJECT_KEY}-backend \
                -Dsonar.java.binaries=target/classes \
                -Dsonar.java.source=17 \
                -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
              
              # Run frontend analysis
              cd ../../apps/frontend/shell
              yarn install
              yarn test --coverage
              sonar-scanner \
                -Dsonar.host.url=${SONAR_HOST_URL} \
                -Dsonar.login=${SONAR_TOKEN} \
                -Dsonar.organization=${SONAR_ORGANIZATION} \
                -Dsonar.projectKey=${SONAR_PROJECT_KEY}-frontend \
                -Dsonar.sources=src \
                -Dsonar.tests=src \
                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                -Dsonar.typescript.tsconfigPath=tsconfig.json
            """
          }
        }
      }
    }

    stage('Quality Gate') {
      when { expression { return SONAR_ENABLED } }
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Build & Push Docker Images') {
      steps {
        withCredentials([usernamePassword(
            credentialsId: "${DOCKER_CREDENTIALS}",
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {
          sh """
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin $DOCKER_REGISTRY
            # build backend
            docker build --platform linux/amd64 \
              -t $IMAGE_BACKEND \
              -f apps/backend/Dockerfile .
            # build frontend
            docker build --platform linux/amd64 \
              -t $IMAGE_FRONTEND \
              -f apps/frontend/shell/Dockerfile .
            docker push $IMAGE_BACKEND
            docker push $IMAGE_FRONTEND
          """
        }
      }
    }

    stage('Cleanup Docker Images') {
      steps {
        script {
          def repos = [
            "${env.DOCKER_REGISTRY}/soul808/vista-backend",
            "${env.DOCKER_REGISTRY}/soul808/vista-frontend"
          ]

          repos.each { repo ->
            // Strategy 1: Keep last N images by tag
            sh """
              echo "🧹 Cleaning up old images for ${repo} (keeping last ${IMAGE_RETENTION_COUNT})..."
              old_tags=\$(docker images "${repo}" --format "{{.Tag}} {{.CreatedAt}}" \
                | grep -v '^latest\$' \
                | sort -r -k2 \
                | awk '{print \$1}' \
                | tail -n +${IMAGE_RETENTION_COUNT})
              
              if [ -n "\$old_tags" ]; then
                echo "🗑️ Removing old tags:"
                echo "\$old_tags"
                echo "\$old_tags" | xargs -r -n1 docker rmi "${repo}:{}"
              else
                echo "✓ No old tags to remove for ${repo}"
              fi
            """

            // Strategy 2: Remove images older than N days
            sh """
              echo "🧹 Removing images older than ${IMAGE_RETENTION_DAYS} days..."
              docker image prune -f --filter "until=${IMAGE_RETENTION_DAYS}h" --filter "label=app=vista"
            """
          }

          // Final cleanup of dangling images
          sh 'docker image prune -f --filter "dangling=true"'
        }
      }
    }

    stage('Deploy to OpenShift') {
      steps {
        withCredentials([string(
            credentialsId: "${OPENSHIFT_CREDENTIALS}",
            variable: 'OC_TOKEN'
        )]) {
          sh """
            oc login https://api.<your-cluster>.openshiftapps.com --token=$OC_TOKEN
            oc project brandonarka3-dev
            oc set image deployment/vista-backend vista-backend=$IMAGE_BACKEND
            oc set image deployment/vista-frontend vista-frontend=$IMAGE_FRONTEND
          """
        }
      }
    }
  }

  post {
    always {
      // Clean workspace
      cleanWs()
      
      // Final system cleanup
      sh '''
        echo "🧹 Performing final Docker system cleanup..."
        docker system prune -f --volumes --filter "until=${IMAGE_RETENTION_DAYS}h"
      '''
    }
  }
}
