#!/bin/bash

set -e

# Build and deploy all MFEs and then the shell, in order
# Don't use watch mode so we can continue to the next MFE after deploying

echo "🚀 Building and deploying all Vista components in sequence..."

# Deploy compliance MFE
echo "\n\n=== STEP 1: Building and deploying Compliance MFE ==="
./ci/build-and-deploy-mfe.sh compliance

# Deploy infrastructure MFE
echo "\n\n=== STEP 2: Building and deploying Infrastructure MFE ==="
./ci/build-and-deploy-mfe.sh infrastructure

# Deploy summary MFE
echo "\n\n=== STEP 3: Building and deploying Summary MFE ==="
./ci/build-and-deploy-mfe.sh summary

# Deploy the Shell app
echo "\n\n=== STEP 4: Building and deploying Shell frontend ==="
./ci/build-and-deploy-fe.sh

echo "\n\n✅ All components have been built and deployed successfully!"
echo "Note: If any pods are in a restart loop, check their logs with:"
echo "  oc logs <pod-name> --previous"
echo "  oc describe pod <pod-name>" 