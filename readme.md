# News Aggregator Platform

A full-stack news aggregator application that pulls articles from various sources and displays them in a clean, easy-to-read format. Built with Laravel (Backend) and React.js (Frontend).

## Prerequisites

- Git
- Docker and Docker Compose
- Access to the following API keys (will be provided via email):
  - NewsAPI
  - The Guardian
  - New York Times

## Quick Start

1. Clone the repository:
`git clone https://github.com/pearlsilver35/news-aggregator.git`
`cd news-aggregator`

2. Create and configure environment files:
   - Check your email for the `.env` files
   - Place `backend/.env` in the `backend` directory
   - Place `frontend/.env` in the `frontend` directory

3. Start the application:
`docker-compose up --build`

The application will automatically:
- Install all dependencies
- Run database migrations
- Start the article scraping service
- Configure the development environment

## Access the Application

Once the containers are running and ready, you can access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- PHPMyAdmin: http://localhost:8080

## Stopping the Application

To stop the application:
`docker-compose down`

This will stop and remove all containers, networks, and volumes created by the `docker-compose up` command.

## Troubleshooting

If you encounter any issues:

1. Ensure all containers are running:
   `docker-compose ps`

2. Check the logs for any errors:
   `docker-compose logs`

3. Rebuild containers if needed:
   `docker-compose down`
   `docker-compose up --build -d`

4. **WSL 2 Integration**: If you receive an error stating that `docker-compose` could not be found, ensure that WSL integration is activated in Docker Desktop settings. For more details, visit:
   [Using Docker Desktop with WSL 2](https://docs.docker.com/go/wsl2/)

## API Documentation

A complete Postman collection is available at:
`backend/news_aggregator_backend.json`

## Support

For any issues or questions, please contact [ayodeleabigailofficial@gmail.com]


