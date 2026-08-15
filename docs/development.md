# Development Guide

## Requirements

- Docker
- Docker Compose
- Git

## Environment

Create a `.env` file in the project root.

The `.env` file contains local secrets and should not be committed.

The `.env.exmaple_template` gives you the structure of the file.

## Database

PostgreSQL is run through Docker Compose.

```bash
#Start the database:
docker compose up -d

#Stop the database:
docker compose down

#Remove the databse and all the data:
docker compose down -v