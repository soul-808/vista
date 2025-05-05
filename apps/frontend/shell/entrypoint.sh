#!/bin/bash
set -e

# Function to log messages with timestamp
log() {
    echo -e "\n[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] $1" > /proc/1/fd/1
}

log "=== Starting container initialization ==="
log "Environment variables:"
env | sort > /proc/1/fd/1

# Validate API_URL
if [ -z "$API_URL" ]; then
    log "ERROR: API_URL environment variable is not set"
    exit 1
fi

log "API_URL is set to: $API_URL"

# Generate runtime configuration directly
log "Generating runtime configuration..."
mkdir -p /opt/app-root/src/assets
TIMESTAMP=$(date +%s)
echo "{\"apiUrl\": \"$API_URL\", \"timestamp\": \"$TIMESTAMP\"}" > /opt/app-root/src/assets/config.json
log "Generated config.json:"
cat /opt/app-root/src/assets/config.json > /proc/1/fd/1

# Replace the API_URL_PLACEHOLDER in nginx config
log "Replacing API_URL_PLACEHOLDER with: $API_URL"
sed -i "s|API_URL_PLACEHOLDER|$API_URL|g" /etc/nginx/conf.d/default.conf
log "Updated nginx config:"
cat /etc/nginx/conf.d/default.conf > /proc/1/fd/1

# Verify nginx configuration
log "Verifying nginx configuration..."
nginx -t > /proc/1/fd/1

# Start nginx with the default parameters
log "=== Starting nginx ==="
exec nginx -g "daemon off;" 