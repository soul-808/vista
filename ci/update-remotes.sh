#!/bin/bash
set -e

# Script to update remote entry URLs in a deployed OpenShift environment
# Usage: ./update-remotes.sh <cluster-domain>
# Example: ./update-remotes.sh brandonarka3-dev.apps.rm3.7wse.p1.openshiftapps.com

if [ $# -ne 1 ]; then
  echo "Usage: $0 <cluster-domain>"
  echo "Example: $0 brandonarka3-dev.apps.rm3.7wse.p1.openshiftapps.com"
  exit 1
fi

CLUSTER_DOMAIN="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TMP_DIR="$(mktemp -d)"
FRONTEND_POD=$(oc get pods -l app=vista-frontend -o jsonpath='{.items[0].metadata.name}')

echo "Creating updated remotes.json..."
cat > "$TMP_DIR/remotes.json" << EOF
{
  "complianceRemote": "https://vista-compliance-${CLUSTER_DOMAIN}/remoteEntry.js",
  "infrastructureRemote": "https://vista-infrastructure-${CLUSTER_DOMAIN}/remoteEntry.js",
  "summaryRemote": "https://vista-summary-${CLUSTER_DOMAIN}/remoteEntry.js"
}
EOF

echo "Copying remotes.json to frontend pod..."
oc cp "$TMP_DIR/remotes.json" "$FRONTEND_POD:/usr/share/nginx/html/assets/remotes.json"

echo "Cleaning up temporary files..."
rm -rf "$TMP_DIR"

echo "✅ Remote configuration updated successfully!"
echo "The shell will use the new remote URLs on the next page load." 