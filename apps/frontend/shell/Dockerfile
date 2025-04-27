# Path: apps/frontend/shell/Dockerfile

# Stage 1: Build Angular shell app
FROM --platform=$BUILDPLATFORM node:18 AS build

WORKDIR /app

# Enable Corepack and set up Yarn 4.x
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate

# Copy workspace files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY libs ./libs
COPY apps/frontend/shell ./apps/frontend/shell

# Install dependencies
RUN yarn install

# Build the shell app
WORKDIR /app/apps/frontend/shell
RUN yarn build

# Debug: Show the contents of the dist directory
RUN echo "=== Contents of dist/shell ===" && \
    ls -la dist/shell && \
    echo "=== Contents of dist/shell/browser ===" && \
    ls -la dist/shell/browser || true

# Stage 2: Serve with NGINX
FROM registry.access.redhat.com/ubi8/nginx-120:latest

# Copy the built app to nginx html directory
COPY --from=build /app/apps/frontend/shell/dist/shell/browser /opt/app-root/src

# OpenShift expects the process to run as a non-root user
USER 1001

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]