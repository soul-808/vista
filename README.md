# Vista - Enterprise Risk Management Platform

**A modern & modular, microservices-based audit system for AI-powered risk insights & management, compliance automation, and enterprise observability.**
Vista helps engineering, compliance, and leadership teams monitor software health, generate audit summaries, and track system risk in a unified view — 
all powered by real code telemetry and AI.

## Project Structure

```
/vista
│
├── apps/                      # Application modules
│   ├── frontend/             # Microfrontends (React)
│   └── backend/              # Spring Boot backend
│
├── libs/                     # Shared libraries
│   ├── shared-auth/         # Authentication utilities
│   ├── shared-models/       # Data models
│   └── shared-utils/        # Common utilities
│
├── ci/                      # CI/CD configurations
├── docker/                  # Docker configurations
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
└── tests/                   # Test suites
```

## Getting Started

### Prerequisites

- Node.js 18+
- Java 8 or 17: https://adoptium.net/ 
- Maven: `brew install maven`
  - mvn -N io.takari:maven:wrapper (if the ./mvnw command doesn't work)
- Docker: https://www.docker.com/
- OpenShift CLI (for deployment)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/vista.git
   cd vista
   ```

2. Start the development environment:
   ```bash
   ./scripts/local-dev.sh
   ```

### Building
- Backend: `cd apps/backend && ./mvnw spring-boot:run`
<!-- ./mvnw clean package -->
- Docker:
`docker build -t vista-backend -f docker/backend/Dockerfile apps/backend`
`docker run -p 8080:8080 vista-backend`
- Docker background service:
`docker run -d -p 8080:8080 vista-backend`
<!-- # get the container ID -->
`docker ps`    
`docker stop <id>`

- Frontend:
<!-- yarn create nx-workspace@latest (maybe later) --> 
yarn add -D @angular/cli
cd apps/frontend
npx @angular/cli new shell --directory=shell --routing=true --style=scss
yarn ng generate component components/health-check




### Testing

- Frontend: `cd apps/frontend && npm test`
- Backend: `cd apps/backend && ./gradlew test`

## Architecture

The platform is built using a microservices architecture with the following components:

- **Frontend**: React-based microfrontends
  - Shell application for routing and layout
  - Dashboard module for analytics
  - Compliance panel for document management
  - AI summary module for risk analysis

- **Backend**: Spring Boot services
  - RESTful APIs
  - Document processing
  - Risk analysis engine
  - Authentication and authorization

## Deployment

The platform is designed to be deployed on OpenShift. See the `ci/openshift` directory for deployment configurations.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Features

- Audit Trail Engine – Ingests deploy logs, coverage, test results, and summarizes risk  
- Compliance AI – Uploads docs (KYC, AML) and uses GPT/LangChain to extract risks  
- Real-Time Dashboard – Displays coverage, auth errors, risk flags, and trends  
- Executive Summary Panel – AI-generated insights based on live telemetry  
- Role-Based Access Control (RBAC) – Custom views for Engineers, Compliance, Executives

## 🧠 Tech Stack

- Frontend: React / Angular (Micro Frontend optional)  
- Backend: Java 8+, Spring Boot, REST API  
- Database: PostgreSQL  
- AI: OpenAI, LangChain, GPT-4  
- CI/CD: GitHub Actions, SonarQube, Terraform, Docker  
- Cloud: AWS + OpenShift-compatible

## 📂 Project Structure

/client/ → Frontend (React)  
/server/ → Backend (Spring Boot)  
/scripts/ → CI telemetry scripts  
/docs/ → Architecture, Use Cases, System Design

## 🛠️ Setup

### Backend
cd server  
./mvnw spring-boot:run

### Frontend
cd client  
npm install  
npm run dev

## 📦 Telemetry Integration

Vista reads real data from your development workflow:
- CI/CD test coverage  
- SonarQube quality reports  
- GitHub commits  
- AI-parsed compliance docs  
- Audit trail + deployment metadata  

All of this powers your dashboards and summaries.

## 📊 Role-Based Views

- 🧑‍💻 Engineer – Audit summaries, test coverage, build health  
- 📋 Compliance – Doc uploader, flagged KYC/AML clauses, audit logs  
- 🧑‍💼 Executive – High-level summaries, risk deltas, system trends

## 🛡️ Why Vista?

In highly regulated environments like banking, visibility isn't optional — it's survival.  
Vista empowers teams to deliver fast, stay compliant, and stay informed — all backed by explainable AI and real-time system health.

## 👤 Author

Brandon Tyler Ward  
[LinkedIn](https://www.linkedin.com/in/brandontylerward)  
[GitHub](https://github.com/soul-808)

## 🏷 GitHub Topics

audit, ai, observability, spring-boot, react, langchain, fintech, compliance, sonarqube, tekton, openshift

---

### Assistants:
GPT create Scafold
Cursor create project from scafold
Create Java Backend with: https://start.spring.io/
TS x DTO (https://quicktype.io/, https://openapi-generator.tech/)
JDK: https://adoptium.net/ 

docker build -t vista-backend -f docker/backend/Dockerfile apps/backend
docker run -p 8080:8080 vista-backend
