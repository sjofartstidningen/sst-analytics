#!/bin/bash
set -ev

echo "Build .env"
node scripts/build-dotenv.js
cat .env
