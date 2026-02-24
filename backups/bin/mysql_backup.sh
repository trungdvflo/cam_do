#!/bin/bash

# MySQL Credentials (consider using a separate config file for better security)
M_USER="root"
M_PASS="1HAbc!23"
M_HOST="localhost"

# Backup Directory
BACKUP_DIR="/home/nodeserver/backups/mysql"

# Filename with timestamp
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/all-databases-$DATE.sql.gz"

# Perform the backup and compress using gzip
mysqldump -u"$M_USER" -p"$M_PASS" -h"$M_HOST" --all-databases | gzip > "$BACKUP_FILE"

# Check if backup was successful
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "MySQL backup created successfully at $BACKUP_FILE" >> /home/nodeserver/log/mysql_backup.log
else
  echo "[ERROR] MySQL backup failed" >> /home/nodeserver/log/mysql_backup.log
fi

# Optional: Delete old backups (e.g., older than 7 days)
find "$BACKUP_DIR" -mtime +7 -delete
