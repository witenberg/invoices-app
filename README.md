# Invoices App

A web application for managing invoices, built with React, Next.js, Node.js, and PostgreSQL. This project runs in Docker containers and is currently in the development phase, with features subject to change and expansion.

## About
This is a learning project where I explore and practice technologies like React, Next.js, Node.js, PostgreSQL, and Docker. It’s inspired by the existing application [Simple Invoices](https://simpleinvoices.io), which served as a reference for its core concept.

## Requirements
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## How to Run
1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/invoices-app.git
   cd invoices-app
   \`\`\`

2. Start the application with Docker:
   \`\`\`bash
   docker-compose up --build
   \`\`\`

3. Open your browser and go to:
   \`\`\`bash
   http://localhost:3000
   \`\`\`

## Configuration
- **Application**: Runs on port 3000.
- **Database**: PostgreSQL with the name SimpleInvoices, user postgres, and password postgres.
- **Environment Variables**: Example configuration in .env.example:
   \`\`\`bash
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/SimpleInvoices
   \`\`\`
  In Docker, this variable is set in docker-compose.yml with swapped "localhost" to "db".

## Project Structure
- Dockerfile: Configuration for the application container.
- docker-compose.yml: Defines the app and db services.
- init.sql: Initializes the database structure.
- .env.example: Example file with environment variables.

## Troubleshooting
- If the database fails to start, check the logs:
   \`\`\`bash
   docker logs invoices-app-db-1
   \`\`\`
- To stop and clean up everything:
   \`\`\`bash
   docker-compose down -v
   \`\`\`
