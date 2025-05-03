#!/bin/bash
set -e

# Backend build and deploy script for Vista application
# This script automatically builds and deploys the backend

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Set Docker to build x86_64 image by default
export DOCKER_DEFAULT_PLATFORM=linux/amd64

# Configuration
DOCKER_REGISTRY="docker.io"
IMAGE_NAME="soul808/vista-backend"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
LATEST_TAG="latest"
TIMESTAMP_TAG="latest-${TIMESTAMP}"
IMAGE="${DOCKER_REGISTRY}/${IMAGE_NAME}"
RETENTION_COUNT=3  # Keep last N images

echo "🚀 Building and deploying backend..."

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
docker rmi ${IMAGE}:${LATEST_TAG} || true

# Build new image with timestamp
if ! docker buildx build \
    --platform=linux/amd64 \
    --load \
    --pull \
    -t ${IMAGE}:${TIMESTAMP_TAG} \
    -t ${IMAGE}:${LATEST_TAG} \
    -f apps/backend/Dockerfile \
    .; then
    echo "❌ Docker build failed"
    exit 1
fi

echo "\n\n📤 Pushing backend images to Docker Hub..."
if ! docker push ${IMAGE}:${TIMESTAMP_TAG}; then
    echo "❌ Docker push failed"
    exit 1
fi
if ! docker push ${IMAGE}:${LATEST_TAG}; then
    echo "❌ Docker push failed"
    exit 1
fi
echo "✅ Backend images pushed"

# Cleanup old timestamped images
echo "🧹 Pruning old timestamped images (keeping last ${RETENTION_COUNT})..."
old_tags=$(docker images "${IMAGE}" --format "{{.Tag}}" \
  | grep '^latest-[0-9]*$' \
  | sort -r \
  | tail -n +$((RETENTION_COUNT + 1)))

if [ -n "$old_tags" ]; then
  echo "🗑️ Removing old backend tags:"
  echo "$old_tags"
  echo "$old_tags" | xargs -r -I{} docker rmi "${IMAGE}:{}"
else
  echo "✓ No old tags to remove"
fi

# Cleanup dangling images
echo "🧹 Cleaning up dangling images..."
docker image prune -f --filter "dangling=true"

# Update deployment yaml with new image tag
echo "\n\n🔄 Updating deployment configuration with new image tag..."
# Create a backup of the original file
cp "$PROJECT_ROOT/ci/openshift/backend-deploy.yaml" "$PROJECT_ROOT/ci/openshift/backend-deploy.yaml.bak"
# Update the image tag - handle any existing timestamp
sed -i '' "s|image: docker.io/soul808/vista-backend:latest-[0-9]*|image: docker.io/soul808/vista-backend:$TIMESTAMP_TAG|" "$PROJECT_ROOT/ci/openshift/backend-deploy.yaml"

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