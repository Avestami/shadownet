# ShadowNet: Tehran 2077 - Docker Setup

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-control
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Web App: http://localhost:3000
   - PostgreSQL: localhost:5432

## Environment Variables

The following environment variables are configured in `docker-compose.yml`:

- `NODE_ENV`: Set to 'production' for the container
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: The URL where your app is hosted
- `NEXTAUTH_SECRET`: Secret key for authentication (change in production!)

## Database

The PostgreSQL database is automatically initialized with:
- Database name: `shadownet`
- Username: `ctfuser`
- Password: `ctfpass`

The `init-db.sql` script creates all necessary tables and inserts initial flag data.

## Volumes

- `postgres_data`: Persists PostgreSQL data
- `./public`: Mounted to allow easy access to audio/image files

## Stopping the Application

```bash
docker-compose down
```

To also remove the database volume:
```bash
docker-compose down -v
```

## Production Deployment

For production deployment:

1. Change the `NEXTAUTH_SECRET` to a secure random string
2. Update `NEXTAUTH_URL` to your production URL
3. Use proper PostgreSQL credentials
4. Consider using environment variable files instead of hardcoding values

## Troubleshooting

If you encounter issues:

1. Check logs: `docker-compose logs app` or `docker-compose logs db`
2. Ensure ports 3000 and 5432 are not already in use
3. Try rebuilding: `docker-compose build --no-cache`
4. Reset everything: `docker-compose down -v && docker-compose up --build` 