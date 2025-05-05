#!/bin/bash

set -e

# Build and deploy Compliance MFE
./ci/build-and-deploy-mfe.sh compliance

# Build and deploy Infrastructure MFE
./ci/build-and-deploy-mfe.sh infrastructure

# Build and deploy Summary MFE
./ci/build-and-deploy-mfe.sh summary

# Build and deploy the Shell app
./ci/build-and-deploy-shell.sh

echo "All MFEs and the shell have been built and deployed in order." 