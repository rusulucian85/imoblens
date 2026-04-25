#!/bin/bash
set -e
cd /home/site/wwwroot

# Remove stale node_modules symlink left by previous Oryx deploys
if [ -L node_modules ]; then
  rm -f node_modules
fi

# Kudu auto-tars node_modules during ZIP deploy to speed up rsync.
# Extract it back if the directory is missing.
if [ ! -d node_modules ] && [ -f node_modules.tar.gz ]; then
  echo "Extracting node_modules.tar.gz..."
  tar -xzf node_modules.tar.gz
fi

exec node server.js
