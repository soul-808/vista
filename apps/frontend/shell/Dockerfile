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
COPY apps/frontend/shared ./apps/frontend/shared

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
FROM --platform=$TARGETPLATFORM registry.access.redhat.com/ubi8/nginx-120:latest

# Switch to root to copy files
USER 0

# Copy the built app to nginx html directory
COPY --from=build /app/apps/frontend/shell/dist/shell /opt/app-root/src

# Copy the NGINX config
COPY apps/frontend/shell/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entrypoint script
COPY apps/frontend/shell/entrypoint.sh /opt/app-root/entrypoint.sh

# Fix permissions
RUN chown -R 1001:0 /opt/app-root && \
    chmod -R g+rw /opt/app-root && \
    chmod +x /opt/app-root/entrypoint.sh && \
    chown -R 1001:0 /etc/nginx/conf.d && \
    chmod -R g+rw /etc/nginx/conf.d

# Set a default API_URL for local testing - will be overridden in OpenShift
ENV API_URL=http://localhost:8080/api

# Switch back to non-root user
USER 1001

EXPOSE 8080

ENTRYPOINT []
CMD ["/opt/app-root/entrypoint.sh"]