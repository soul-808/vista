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
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build & Test Backend') {
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
        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
          sh """
            sonar-scanner \
              -Dsonar.projectKey=vista \
              -Dsonar.sources=. \
              -Dsonar.tests=apps/backend/src/test,apps/frontend/shell/src \
              -Dsonar.java.binaries=apps/backend/target/classes \
              -Dsonar.coverage.jacoco.xmlReportPaths=apps/backend/target/site/jacoco/jacoco.xml \
              -Dsonar.javascript.lcov.reportPaths=apps/frontend/shell/coverage/lcov.info \
              -Dsonar.host.url=https://sonar.mycompany.com \
              -Dsonar.login=$SONAR_TOKEN
          """
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
      cleanWs()
    }
  }
}
