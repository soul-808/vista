#!/bin/bash
set -e

# Configuration
BACKUP_DIR="./backups"
LOCAL_PORT=5433

# Function to list available backups
list_backups() {
    echo "Available backups:"
    ls -lh ${BACKUP_DIR}/*.sql.gz 2>/dev/null || echo "No backups found in ${BACKUP_DIR}"
}

# Function to validate backup file
validate_backup() {
    local backup_file=$1
    if [ ! -f "$backup_file" ]; then
        echo "Error: Backup file '$backup_file' not found"
        exit 1
    fi
}

# Check if backup file is provided
if [ "$1" == "--list" ]; then
    list_backups
    exit 0
fi

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file> or $0 --list to see available backups"
    list_backups
    exit 1
fi

BACKUP_FILE=$1
validate_backup "$BACKUP_FILE"

# Get database credentials from OpenShift secret
echo "Getting database credentials from OpenShift..."
DB_PASSWORD=$(oc get secret vista-db-secret -o jsonpath='{.data.password}' | base64 --decode)
DB_USER="vista_user"
DB_NAME="vista"

# Start port forwarding in the background
echo "Setting up port forwarding..."
oc port-forward service/postgres ${LOCAL_PORT}:5432 &
PF_PID=$!

# Wait for port forwarding to be ready
sleep 5

echo "Starting database restore..."
echo "Source: ${BACKUP_FILE}"
echo "Database: ${DB_NAME}"
echo "User: ${DB_USER}"
echo "Local port: ${LOCAL_PORT}"

# Drop existing connections
echo "Dropping existing connections..."
PGPASSWORD=${DB_PASSWORD} psql -h localhost -p ${LOCAL_PORT} -U ${DB_USER} -d postgres -c "
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = '${DB_NAME}'
  AND pid <> pg_backend_pid();" >/dev/null 2>&1 || true

# Drop and recreate database
echo "Recreating database..."
PGPASSWORD=${DB_PASSWORD} psql -h localhost -p ${LOCAL_PORT} -U ${DB_USER} -d postgres -c "
DROP DATABASE IF EXISTS ${DB_NAME};
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" >/dev/null 2>&1

# Restore the backup
echo "Restoring from backup..."
gunzip -c "${BACKUP_FILE}" | PGPASSWORD=${DB_PASSWORD} psql -h localhost -p ${LOCAL_PORT} -U ${DB_USER} -d ${DB_NAME}

# Check if restore was successful
RESTORE_STATUS=$?

# Kill port forwarding
kill $PF_PID 2>/dev/null || true

if [ $RESTORE_STATUS -eq 0 ]; then
    echo "✅ Database restore completed successfully!"
else
    echo "❌ Database restore failed!"
    exit 1
fi 