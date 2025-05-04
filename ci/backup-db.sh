#!/bin/bash
set -e

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/vista_db_${TIMESTAMP}.sql.gz"
LOCAL_PORT=5433

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

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

echo "Starting database backup..."
echo "Database: ${DB_NAME}"
echo "User: ${DB_USER}"
echo "Local port: ${LOCAL_PORT}"

# Perform the backup
PGPASSWORD=${DB_PASSWORD} pg_dump -h localhost -p ${LOCAL_PORT} -U ${DB_USER} -d ${DB_NAME} | gzip > ${BACKUP_FILE}

# Check if backup was successful
BACKUP_STATUS=$?

# Kill port forwarding
kill $PF_PID 2>/dev/null || true

if [ $BACKUP_STATUS -eq 0 ]; then
    echo "Backup completed successfully: ${BACKUP_FILE}"
    
    # List all backups
    echo "Current backups:"
    ls -lh ${BACKUP_DIR}
    
    # Keep only the last 7 backups
    echo "Cleaning up old backups..."
    ls -t ${BACKUP_DIR}/vista_db_*.sql.gz | tail -n +8 | xargs -r rm
    
    echo "Backup cleanup completed"
else
    echo "Backup failed!"
    exit 1
fi 