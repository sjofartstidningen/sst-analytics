#!/bin/bash
set -ev

BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}
NODE_ENV="development"

if [[ $BRANCH == 'master' ]]; then
  NODE_ENV="production"
fi

echo "Build .env"
node scripts/build-dotenv.js
