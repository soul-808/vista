// Path: Jenkinsfile

pipeline {
  agent any

  environment {
    DOCKER_IMAGE = 'soul808/vista'
    DOCKER_TAG = "${env.BUILD_NUMBER}"
    OPENSHIFT_PROJECT = 'brandonarka3-dev'
    SONAR_HOST_URL = 'https://sonarcloud.io'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Backend') {
      steps {
        dir('apps/backend') {
          sh 'mvn clean package -DskipTests'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('apps/frontend/shell') {
          sh 'yarn install'
          sh 'yarn build'
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarCloud') {
          withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
            sh '''
              # Run backend analysis
              cd apps/backend
              mvn clean verify sonar:sonar \
                -Dsonar.host.url=${SONAR_HOST_URL} \
                -Dsonar.login=${SONAR_TOKEN} \
                -Dsonar.organization=soul808 \
                -Dsonar.projectKey=soul808_vista-backend \
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
                -Dsonar.organization=soul808 \
                -Dsonar.projectKey=soul808_vista-frontend \
                -Dsonar.sources=src \
                -Dsonar.tests=src \
                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                -Dsonar.typescript.tsconfigPath=tsconfig.json
            '''
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Build and Push Docker Images') {
      steps {
        script {
          // Build and push backend image
          docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-creds') {
            def backendImage = docker.build("${DOCKER_IMAGE}-backend:${DOCKER_TAG}", 
              "--platform linux/amd64 -f apps/backend/Dockerfile .")
            backendImage.push()
          }
          
          // Build and push frontend image
          docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-creds') {
            def frontendImage = docker.build("${DOCKER_IMAGE}-frontend:${DOCKER_TAG}", 
              "--platform linux/amd64 -f apps/frontend/shell/Dockerfile .")
            frontendImage.push()
          }
        }
      }
    }

    stage('Deploy to OpenShift') {
      steps {
        script {
          withCredentials([string(credentialsId: 'openshift-token', variable: 'OC_TOKEN')]) {
            sh '''
              oc login --token=${OC_TOKEN} --server=https://api.silver.devops.gov.bc.ca:6443
              oc project ${OPENSHIFT_PROJECT}
              
              # Update backend deployment
              oc set image deployment/vista-backend vista-backend=soul808/vista-backend:${DOCKER_TAG}
              
              # Update frontend deployment
              oc set image deployment/vista-frontend vista-frontend=soul808/vista-frontend:${DOCKER_TAG}
            '''
          }
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
    success {
      echo 'Pipeline completed successfully!'
    }
    failure {
      echo 'Pipeline failed!'
    }
  }
}
