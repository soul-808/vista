# Vista - Enterprise Risk Management Platform

**A modern & modular, microservices-based audit system for AI-powered risk insights & management, compliance automation, and enterprise observability.**
Vista helps engineering, compliance, and leadership teams monitor software health, generate audit summaries, and track system risk in a unified view — 
all powered by real code telemetry and AI.

![9sxifm](https://github.com/user-attachments/assets/eda6fc9f-4367-487e-b44a-1fd963ea931b)

![vista-architecture-diagram-v1](https://github.com/user-attachments/assets/dfe9b210-7188-44a4-81d0-881d392dc07e)



## Project Structure

```
/vista
│
├── apps/                      # Application modules
│   ├── frontend/             # Microfrontends (React)
│   │   └── shell/           # Main Angular shell app
│   └── backend/              # Spring Boot backend
│
├── libs/                     # Shared libraries
│   ├── shared-auth/         # Authentication utilities
│   ├── shared-models/       # Data models
│   └── shared-utils/        # Common utilities
│
├── ci/                      # CI/CD configurations
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
- brew install postgresql@13
  - echo 'export PATH="/opt/homebrew/opt/postgresql@13/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc

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
- Docker:
  ```bash
  # Build backend
  docker build -t vista-backend apps/backend
  
  # Build frontend
  docker build -t vista-shell apps/frontend/shell
  
  # Run with docker-compose
  <!-- docker-compose -f ci/docker-compose.dev.yaml up -->
  docker compose -f ci/docker-compose.dev.yaml down
  docker compose -f ci/docker-compose.dev.yaml up --build
  ```
### Local Dev
// forward the db to a local port
DB: `oc port-forward svc/postgres 5432:5432`
Run Backend: `mvn spring-boot:run`
Run Frontend: `yarn start`

### Testing

- Frontend: `cd apps/frontend/shell && yarn test`
- Backend: `cd apps/backend && ./mvnw test`

### Deploying
1. Start Docker Desktop
2. Run: `oc apply -f ci/openshift/postgres-secret.yaml`
2. Run: `./ci./ci/build-and-deploy-be.sh`
3. Run: `./ci/build-and-deploy-fe.sh`
  ./ci/build-and-deploy-mfe.sh compliance
  ./ci/build-and-deploy-mfe.sh infrastructure
  ./ci/build-and-deploy-mfe.sh summary
  <!-- Validation -->
  oc get pods -l app=vista-compliance
  oc get pods -l app=vista-infrastructure
  oc get pods -l app=vista-summary
  oc get route vista-compliance -o yaml
  oc get route vista-infrastructure -o yaml
  oc get route vista-summary -o yaml

> 💡 **Tip**: For CI/CD, install Jenkins via OperatorHub and apply `ci/openshift/jenkins-cr.yaml`. See `Jenkinsfile` for pipeline config.

> Login url with oAuth enabled
`https://jenkins-brandonarka3-dev.apps.rm3.7wse.p1.openshiftapps.com/` 

### Database Management

#### Backup
The project includes scripts to manage PostgreSQL database backups:

```bash
# Create a backup
./ci/backup-db.sh

# List existing backups
./ci/backup-db.sh --list
```

The backup script will:
- Create compressed backups in the `./backups` directory
- Name files with timestamps (e.g., `vista_db_20250503_133618.sql.gz`)
- Automatically maintain the last 7 backups
- Handle port forwarding to the OpenShift PostgreSQL pod

#### Restore
To restore from a backup:

```bash
# List available backups
./ci/restore-db.sh --list

# Restore from a specific backup
./ci/restore-db.sh ./backups/vista_db_YYYYMMDD_HHMMSS.sql.gz
```

The restore script will:
- Validate the backup file exists
- Set up port forwarding to the database
- Drop existing connections
- Recreate the database
- Restore the data from the backup

Note: Ensure you have the PostgreSQL client tools installed:
```bash
brew install postgresql@13
echo 'export PATH="/opt/homebrew/opt/postgresql@13/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```
### CI/CD
Jenkins:
- oc apply -f https://raw.githubusercontent.com/openshift/jenkins-operator/master/deploy/jenkins-operator.yaml
- POST https://jenkins-brandonarka3-dev.apps.rm3.7wse.p1.openshiftapps.com/github-webhook/ (Content-Type: application/json)




## Architecture

The platform is built using a microservices architecture with the following components:

- **Frontend**: Angular-based shell application
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

<!-- For m3 mac and multiple platforms -->
# Create a new builder instance
docker buildx create --name mybuilder --driver docker-container --bootstrap

# Use the new builder
docker buildx use mybuilder

# Now build and push the images
docker buildx build --platform linux/amd64,linux/arm64 -t soul808/vista-frontend:latest --push -f apps/frontend/shell/Dockerfile .

docker buildx create --use --name multiarch-builder
docker buildx inspect --bootstrap

# OpenShift Modular Frontend Deployment (MFEs & Shell)

## Overview
This project uses a modular frontend architecture (MFEs) and a shell (host) app, all deployable to OpenShift with automated scripts and environment-specific configuration.

---

## 1. Environment Configuration for Shell
- The shell uses `src/environments/environment.openshift.ts` for OpenShift deployments.
- RemoteEntry URLs for each MFE are set here:
  ```ts
  export const environment = {
    production: true,
    complianceRemote: 'https://<your-cluster-domain>/compliance/remoteEntry.js',
    infrastructureRemote: 'https://<your-cluster-domain>/infrastructure/remoteEntry.js',
    summaryRemote: 'https://<your-cluster-domain>/summary/remoteEntry.js',
    // ...
  };
  ```
- The Angular build config in `angular.json` uses file replacement to swap in this file for OpenShift builds.

---

## 2. Building & Deploying

### Backend
  oc scale statefulset postgres --replicas=1
oc apply -f ci/openshift/backend-secrets.yaml
./ci/build-and-deploy-be.sh

### Shell
- Use the script:
  ```bash
  ./ci/build-and-deploy-shell.sh
  ```
- This will:
  - Build the shell with the OpenShift config
  - Build and push the Docker image
  - Prune old images
  - Update the deployment YAML
  - Deploy to OpenShift

### MFEs
- Use the script for each MFE:
  ```bash
  ./ci/build-and-deploy-mfe.sh <mfe-name>
  # e.g.
  ./ci/build-and-deploy-mfe.sh compliance
  ./ci/build-and-deploy-mfe.sh infrastructure
  ./ci/build-and-deploy-mfe.sh summary
  ```

---

## 3. OpenShift Manifests
- Each app (shell and MFEs) has a deployment, service, and route YAML in `ci/openshift/`.
- These are updated and applied by the scripts above.

---

## 4. CI/CD Integration
- Add the build-and-deploy scripts to your Jenkinsfile or other CI/CD pipeline for automated deployments.

---

## 5. Validation
- Check pod and route status:
  ```bash
  oc get pods -l app=vista-frontend
  oc get pods -l app=vista-compliance
  oc get pods -l app=vista-infrastructure
  oc get pods -l app=vista-summary
  oc get route
  ```
- Test in browser:
  - `https://<your-cluster-domain>/`
  - `https://<your-cluster-domain>/compliance`
  - `https://<your-cluster-domain>/infrastructure`
  - `https://<your-cluster-domain>/summary`

---

## 6. Advanced: Runtime Remote Config (Optional)
- You can load remoteEntry URLs at runtime (not just build time) by serving a JSON config (e.g., `/assets/remotes.json`) and fetching it in your shell at startup.
- This allows you to change remote endpoints without rebuilding the shell.
- See below for more details.

## 7. Advanced: Runtime Remote Config for Angular Shell

Instead of hardcoding remoteEntry URLs at build time, you can load them dynamically at runtime. This allows you to update remote endpoints without rebuilding or redeploying the shell.

### 1. Create a JSON Config
Place a file like `remotes.json` in your shell's `src/assets/`:
```json
{
  "complianceRemote": "https://<your-cluster-domain>/compliance/remoteEntry.js",
  "infrastructureRemote": "https://<your-cluster-domain>/infrastructure/remoteEntry.js",
  "summaryRemote": "https://<your-cluster-domain>/summary/remoteEntry.js"
}
```

### 2. Fetch the Config at Runtime
In your shell's `main.ts` (or before bootstrapping the app), fetch this config:
```ts
// src/main.ts
fetch('/assets/remotes.json')
  .then(response => response.json())
  .then(remotes => {
    window['remoteConfig'] = remotes;
    import('./bootstrap').then(({ bootstrap }) => bootstrap());
  });
```

### 3. Use the Config in Module Federation
When setting up your remotes (e.g., in your custom webpack config or dynamic federation logic), reference `window['remoteConfig']`:
```ts
const remotes = window['remoteConfig'];
const complianceRemoteUrl = remotes.complianceRemote;
// Use this URL to load the remoteEntry.js dynamically
```

### 4. Update remotes.json Without Rebuilding
You can now update `remotes.json` in your deployed assets (e.g., via a script or manually), and the shell will pick up new remote URLs on the next page load.

#### Benefits
- No rebuild/redeploy needed for remote URL changes.
- Easier blue/green or canary deployments for MFEs.
- Centralized config for all remotes.

If you want a full code sample or help wiring this into your Angular shell, just ask!
