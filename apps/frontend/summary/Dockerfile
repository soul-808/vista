# Stage 1: Build MFE
FROM node:18 AS build

WORKDIR /app
COPY package.json yarn.lock ./
COPY . .
RUN yarn install
RUN yarn build

# Stage 2: Serve with OpenShift-ready NGINX
FROM registry.access.redhat.com/ubi8/nginx-120:latest

USER 0

# Copy built assets
COPY --from=build /app/dist /opt/app-root/src

# Copy NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permissions
RUN chown -R 1001:0 /opt/app-root && \
    chmod -R g+rw /opt/app-root && \
    chown -R 1001:0 /etc/nginx/conf.d && \
    chmod -R g+rw /etc/nginx/conf.d

USER 1001

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"] 