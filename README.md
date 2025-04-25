# Vista

**A modular, AI-powered observability and audit platform for enterprise systems**

Vista helps engineering, compliance, and leadership teams monitor software health, generate audit summaries, and track system risk in a unified view — all powered by real code telemetry and AI.

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

In highly regulated environments like banking, visibility isn’t optional — it’s survival.  
Vista empowers teams to deliver fast, stay compliant, and stay informed — all backed by explainable AI and real-time system health.

## 👤 Author

Brandon Tyler Ward  
[LinkedIn](https://www.linkedin.com/in/brandontylerward)  
[GitHub](https://github.com/soul-808)

## 🏷 GitHub Topics

audit, ai, observability, spring-boot, react, langchain, fintech, compliance, sonarqube, tekton, openshift

---
