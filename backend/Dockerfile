# Use an official PHP runtime as a parent image
FROM php:8.1-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    default-mysql-client

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create a user with the same UID and GID as the host user
ARG UID
ARG GID
RUN groupadd -g $GID appgroup && \
    useradd -u $UID -g appgroup -m appuser

# Switch to the new user
USER appuser

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["sh", "/var/www/html/start.sh"] 