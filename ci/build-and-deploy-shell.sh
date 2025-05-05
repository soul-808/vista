#!/bin/bash
set -e

# Shell/Frontend build and deploy script for Vista application
# This script automatically builds and deploys the shell frontend

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OPENSHIFT_DIR="$SCRIPT_DIR/openshift"

# Set Docker to build x86_64 image by default
export DOCKER_DEFAULT_PLATFORM=linux/amd64

# Configuration
DOCKER_REGISTRY="docker.io"
IMAGE_NAME="soul808/vista-frontend"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
LATEST_TAG="latest"
TIMESTAMP_TAG="latest-${TIMESTAMP}"
IMAGE="${DOCKER_REGISTRY}/${IMAGE_NAME}"
RETENTION_COUNT=3  # Keep last N images

SHELL_PATH="$PROJECT_ROOT/apps/frontend/shell"
DEPLOY_YAML="$OPENSHIFT_DIR/frontend-deploy.yaml"
DEPLOY_YAML_BAK="$DEPLOY_YAML.bak"

echo "🚀 Building and deploying shell frontend..."

# Build Angular application
echo "\n\n🏗️ Building Angular shell application..."
cd "$SHELL_PATH"

# Clean the build directory
echo "\n\n🧹 Cleaning build directory..."
rm -rf dist/
rm -rf .angular/cache/

if ! yarn build --configuration=openshift; then
    echo "❌ Angular build failed"
    exit 1
fi

# Check that the build output exists
if [ ! -d "dist/shell" ]; then
    echo "❌ Build output directory dist/shell does not exist. Build may have failed or outputPath is incorrect."
    exit 1
fi

echo "✅ Angular shell build completed"

# Build and push Docker image
echo "\n\n🐳 Building Docker image for x86_64 architecture..."
cd "$PROJECT_ROOT"

# Remove existing images
echo "\n\n🗑️ Removing existing Docker images..."
docker rmi ${IMAGE}:${LATEST_TAG} || true

# Create temporary Dockerfile for production
TEMP_DOCKERFILE="${SHELL_PATH}/Dockerfile.temp"
cat > "${TEMP_DOCKERFILE}" << EOF
FROM nginx:alpine

# Switch to root to make changes
USER root

# Create directories and set permissions for OpenShift compatibility
RUN mkdir -p /tmp/nginx/client_temp && \
    mkdir -p /tmp/nginx/proxy_temp && \
    mkdir -p /tmp/nginx/fastcgi_temp && \
    mkdir -p /tmp/nginx/uwsgi_temp && \
    mkdir -p /tmp/nginx/scgi_temp && \
    mkdir -p /tmp/nginx/pid && \
    chmod -R 777 /tmp/nginx && \
    chmod -R 777 /var/cache/nginx /var/run /var/log/nginx

# Add custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Configure nginx to use the custom temp and pid paths
RUN echo 'client_body_temp_path /tmp/nginx/client_temp;' > /etc/nginx/conf.d/temp_paths.conf && \
    echo 'proxy_temp_path /tmp/nginx/proxy_temp;' >> /etc/nginx/conf.d/temp_paths.conf && \
    echo 'fastcgi_temp_path /tmp/nginx/fastcgi_temp;' >> /etc/nginx/conf.d/temp_paths.conf && \
    echo 'uwsgi_temp_path /tmp/nginx/uwsgi_temp;' >> /etc/nginx/conf.d/temp_paths.conf && \
    echo 'scgi_temp_path /tmp/nginx/scgi_temp;' >> /etc/nginx/conf.d/temp_paths.conf

# Copy the application files
COPY dist/shell /usr/share/nginx/html
COPY health.json /usr/share/nginx/html/health

# Expose the port
EXPOSE 8080

# Switch to non-root user for OpenShift compatibility (arbitrary user ID)
USER 1001

# Run nginx without daemon mode
CMD ["nginx", "-g", "daemon off;"]
EOF

# Build new image with timestamp
if ! docker buildx build \
    --platform=linux/amd64 \
    --load \
    --pull \
    -t ${IMAGE}:${TIMESTAMP_TAG} \
    -t ${IMAGE}:${LATEST_TAG} \
    -f "${TEMP_DOCKERFILE}" \
    "${SHELL_PATH}"; then
    echo "❌ Docker build failed"
    rm -f "${TEMP_DOCKERFILE}"
    exit 1
fi

# Remove temporary Dockerfile
rm -f "${TEMP_DOCKERFILE}"

echo "\n\n📤 Pushing shell frontend images to Docker Hub..."
if ! docker push ${IMAGE}:${TIMESTAMP_TAG}; then
    echo "❌ Docker push failed"
    exit 1
fi
if ! docker push ${IMAGE}:${LATEST_TAG}; then
    echo "❌ Docker push failed"
    exit 1
fi
echo "✅ Shell frontend images pushed"

# Cleanup old timestamped images
echo "🧹 Pruning old timestamped images (keeping last ${RETENTION_COUNT})..."
old_tags=$(docker images "${IMAGE}" --format "{{.Tag}}" \
  | grep '^latest-[0-9]*$' \
  | sort -r \
  | tail -n +$((RETENTION_COUNT + 1)))

if [ -n "$old_tags" ]; then
  echo "🗑️ Removing old shell frontend tags:"
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
cp "${DEPLOY_YAML}" "${DEPLOY_YAML_BAK}"
# Update the image tag - using a more robust pattern that matches the entire image line
sed -i '' "s|image: ${IMAGE}:[^[:space:]]*|image: ${IMAGE}:${TIMESTAMP_TAG}|" "${DEPLOY_YAML}"
sed -i '' "s|timestamp:.*|timestamp: \"${TIMESTAMP}\"|" "${DEPLOY_YAML}"

# Deploy to OpenShift
echo "\n\n🚀 Deploying to OpenShift..."
echo "🗑️ Deleting existing deployment..."
oc delete deployment/vista-frontend --ignore-not-found=true

echo "\n\n🔄 Applying new deployment configuration..."
if ! oc apply -f "${DEPLOY_YAML}"; then
    echo "❌ OpenShift deployment failed"
    exit 1
fi

echo "\n\n✅ Deployment initiated. Watching pod status..."
oc get pods -l app=vista-frontend -w 