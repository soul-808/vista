# Build stage
FROM --platform=$BUILDPLATFORM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /apps/backend

# Copy pom files
COPY apps/backend/pom.xml .
RUN mvn dependency:go-offline

# Build the application
COPY apps/backend/src ./src
RUN mvn clean package -DskipTests

# Production stage
FROM registry.access.redhat.com/ubi8/openjdk-17:latest

# Copy built jar from build stage
COPY --from=build /apps/backend/target/*.jar /deployments/app.jar

# OpenShift runs containers with a random UID, no need to create a user
USER 1001

EXPOSE 8080

# Add health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Set JVM options for better performance
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC"

# The OpenShift base image expects this command
CMD java $JAVA_OPTS -jar /deployments/app.jar


# Multi-stage build notes:
# Ensuring you don't need Maven installed in production
# Caches the dependencies, so minor code changes rebuild faster
# Pulls in just the JRE (Java Runtime) — no compiler, no Maven
# Shrinks your image size dramatically
# Reduces the attack surface for security
# Ideal for OpenShift or CI/CD environments

