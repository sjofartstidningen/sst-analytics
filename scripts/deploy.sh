#!/bin/bash
set -ev

BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}
STAGE="dev"
NODE_ENV="development"

if [[ $BRANCH == 'master' ]]; then
  STAGE="production"
  NODE_ENV="production"
fi

echo "Building source files from src/ to lib/ with Babel"
npm run build

echo "Deploying from branch ${BRANCH} to stage ${STAGE} with NODE_ENV=${NODE_ENV}"
NODE_ENV=${NODE_ENV} serverless deploy --stage ${STAGE}
