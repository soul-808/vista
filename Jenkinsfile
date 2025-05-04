// Path: Jenkinsfile

pipeline {
  agent {
    kubernetes {
      yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: maven
            image: maven:3.9.6-eclipse-temurin-17
            command:
            - cat
            tty: true
            volumeMounts:
            - mountPath: /root/.m2
              name: maven-cache
          - name: node
            image: node:18
            command:
            - cat
            tty: true
          - name: docker
            image: docker:latest
            command:
            - cat
            tty: true
            volumeMounts:
            - mountPath: /var/run/docker.sock
              name: docker-sock
          volumes:
          - name: maven-cache
            emptyDir: {}
          - name: docker-sock
            hostPath:
              path: /var/run/docker.sock
      '''
    }
  }

  environment {
    BACKEND_IMAGE = 'soul808/vista-backend'
    FRONTEND_IMAGE = 'soul808/vista-frontend'
    DOCKER_TAG = "${env.BUILD_NUMBER}"
    OPENSHIFT_PROJECT = 'brandonarka3-dev'
    OPENSHIFT_SERVER = 'https://api.silver.devops.gov.bc.ca:6443'
    SONAR_HOST_URL = 'https://sonarcloud.io'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          extensions: [],
          userRemoteConfigs: [[
            credentialsId: 'github-token',
            url: 'https://github.com/soul808/vista.git'
          ]]
        ])
      }
    }

    stage('Build Backend') {
      steps {
        container('maven') {
          dir('apps/backend') {
            sh 'mvn clean package -DskipTests'
          }
        }
      }
    }

    stage('Build Frontend') {
      steps {
        container('node') {
          dir('apps/frontend/shell') {
            sh 'yarn install'
            sh 'yarn build'
          }
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarCloud') {
          withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
            container('maven') {
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
              '''
            }
            container('node') {
              sh '''
                # Run frontend analysis
                cd apps/frontend/shell
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
        container('docker') {
          script {
            // Build and push backend image
            docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-creds') {
              def backendImage = docker.build("${BACKEND_IMAGE}:${DOCKER_TAG}", 
                "--platform linux/amd64 -f apps/backend/Dockerfile .")
              backendImage.push()
            }
            
            // Build and push frontend image
            docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-creds') {
              def frontendImage = docker.build("${FRONTEND_IMAGE}:${DOCKER_TAG}", 
                "--platform linux/amd64 -f apps/frontend/shell/Dockerfile .")
              frontendImage.push()
            }
          }
        }
      }
    }

    stage('Deploy to OpenShift') {
      steps {
        script {
          withCredentials([string(credentialsId: 'openshift-token', variable: 'OC_TOKEN')]) {
            sh '''
              oc login --token=${OC_TOKEN} --server=${OPENSHIFT_SERVER}
              oc project ${OPENSHIFT_PROJECT}
              
              # Update backend deployment
              oc set image deployment/vista-backend vista-backend=${BACKEND_IMAGE}:${DOCKER_TAG}
              
              # Update frontend deployment
              oc set image deployment/vista-frontend vista-frontend=${FRONTEND_IMAGE}:${DOCKER_TAG}
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
