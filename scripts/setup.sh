#!/bin/bash

# chmod +x scripts/setup.sh && ./scripts/setup.sh

# Create main directory structure
mkdir -p apps/frontend/{shell,dashboard,compliance-panel,ai-summary,shared}
mkdir -p apps/backend/src/{main,test}/{java,resources}
mkdir -p libs/{shared-auth,shared-models,shared-utils}
mkdir -p ci/openshift
mkdir -p docker/{frontend,backend}
mkdir -p docs/arch-diagrams
mkdir -p scripts
mkdir -p tests/{selenium,junit}

# Create initial files
touch apps/frontend/shell/package.json
touch apps/frontend/dashboard/package.json
touch apps/frontend/compliance-panel/package.json
touch apps/frontend/ai-summary/package.json
touch apps/frontend/shared/package.json

# Create Maven project structure
touch apps/backend/pom.xml
touch apps/backend/src/main/resources/application.yml
touch apps/backend/src/main/java/com/vista/Application.java
touch apps/backend/src/test/java/com/vista/ApplicationTests.java

touch ci/Jenkinsfile
touch ci/sonar-project.properties
touch ci/openshift/{frontend-deploy.yaml,backend-deploy.yaml,configmap.yaml}
touch ci/docker-compose.dev.yaml

touch docker/frontend/Dockerfile
touch docker/backend/Dockerfile

touch docs/BDD-scenarios.md
touch scripts/local-dev.sh
touch scripts/openshift-init.sh

# Make scripts executable
chmod +x scripts/*.sh

echo "Project structure created successfully!" 