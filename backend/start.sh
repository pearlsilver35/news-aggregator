#!/bin/bash

# Set the environment to local
export APP_ENV=local

# Wait for MySQL to be ready
until mysql -h"$DB_HOST" -u"$DB_USERNAME" -p"$DB_PASSWORD" -e 'select 1'; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 1
done

# Create the database if it doesn't exist
mysql -h"$DB_HOST" -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \`$DB_DATABASE\`;"

# Run Laravel setup tasks
php artisan migrate:refresh --force
php artisan optimize:clear

# Run the scrape command on startup with the local environment
php artisan articles:scrape --env=local

# Start the Laravel scheduler
php artisan schedule:work &

# Start PHP-FPM
php-fpm 