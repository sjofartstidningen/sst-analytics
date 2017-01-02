#!/bin/bash
set -e

BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}
STAGE="dev"
NODE_ENV="development"

if [[ $BRANCH == 'master' ]]; then
  STAGE="production"
  NODE_ENV="production"
fi

echo "Deploying from branch $BRANCH to stage $STAGE and with NODE_ENV=$NODE_ENV"
npm run build
serverless deploy --verbose --stage $STAGE
