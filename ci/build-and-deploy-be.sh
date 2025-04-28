#!/bin/bash
set -e

# Backend build and deploy script for Vista application
# This script automatically builds and deploys the backend

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Set Docker to build x86_64 image by default
export DOCKER_DEFAULT_PLATFORM=linux/amd64

# Build Spring Boot application
echo "\n\n🏗️ Building Spring Boot application..."
cd "$PROJECT_ROOT/apps/backend"
if ! ./mvnw clean package -DskipTests; then
    echo "❌ Maven build failed"
    exit 1
fi
echo "✅ Spring Boot build completed"

# Build and push Docker image
echo "\n\n🐳 Building Docker image for x86_64 architecture..."
cd "$PROJECT_ROOT"

# Remove existing images
echo "\n\n🗑️ Removing existing Docker images..."
docker rmi docker.io/soul808/vista-backend:latest || true

# Add timestamp for versioning
TIMESTAMP=$(date +%s)
IMAGE_TAG="latest-$TIMESTAMP"

if ! docker buildx build \
    --platform=linux/amd64 \
    --load \
    --pull \
    -t docker.io/soul808/vista-backend:$IMAGE_TAG \
    -t docker.io/soul808/vista-backend:latest \
    -f apps/backend/Dockerfile \
    .; then
    echo "❌ Docker build failed"
    exit 1
fi

echo "\n\n📤 Pushing backend images to Docker Hub..."
if ! docker push docker.io/soul808/vista-backend:$IMAGE_TAG; then
    echo "❌ Docker push failed"
    exit 1
fi
if ! docker push docker.io/soul808/vista-backend:latest; then
    echo "❌ Docker push failed"
    exit 1
fi
echo "✅ Backend images pushed"

# Update deployment yaml with new image tag
echo "\n\n🔄 Updating deployment configuration with new image tag..."
# Create a backup of the original file
cp "$PROJECT_ROOT/ci/openshift/backend-deploy.yaml" "$PROJECT_ROOT/ci/openshift/backend-deploy.yaml.bak"
# Update the image tag
sed -i '' "s|image: docker.io/soul808/vista-backend:latest|image: docker.io/soul808/vista-backend:$IMAGE_TAG|" "$PROJECT_ROOT/ci/openshift/backend-deploy.yaml"

# Deploy to OpenShift
echo "\n\n🚀 Deploying to OpenShift..."
echo "🗑️ Deleting existing deployment..."
oc delete deployment/vista-backend --ignore-not-found=true

echo "\n\n🔄 Applying new deployment configuration..."
if ! oc apply -f "$PROJECT_ROOT/ci/openshift/backend-deploy.yaml"; then
    echo "❌ OpenShift deployment failed"
    exit 1
fi

echo "\n\n✅ Deployment initiated. Watching pod status..."
oc get pods -l app=vista-backend -w 