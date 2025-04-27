# Path: apps/frontend/shell/Dockerfile

# Stage 1: Build Angular shell app
FROM node:18 AS build

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
FROM nginx:alpine

# Copy the built app to nginx html directory
COPY --from=build /app/apps/frontend/shell/dist/shell/browser /usr/share/nginx/html
COPY apps/frontend/shell/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]