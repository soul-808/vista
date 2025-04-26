# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom files
COPY pom.xml .
RUN mvn dependency:go-offline

# Build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]


# Multi-stage build notes:
# Ensuring you don’t need Maven installed in production
# Caches the dependencies, so minor code changes rebuild faster
# Pulls in just the JRE (Java Runtime) — no compiler, no Maven
# Shrinks your image size dramatically
# Reduces the attack surface for security
# Ideal for OpenShift or CI/CD environments