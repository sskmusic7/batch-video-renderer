#!/bin/bash
# Live deployment monitoring script

cd "$(dirname "$0")/.."

echo "🔴 Live Deployment Monitor"
echo "=========================="
echo ""

# Get latest run
LATEST_RUN=$(gh run list --workflow=deploy-cloudrun.yml --limit 1 --json databaseId --jq '.[0].databaseId')

if [ -z "$LATEST_RUN" ]; then
    echo "❌ No runs found"
    exit 1
fi

echo "📊 Monitoring run: $LATEST_RUN"
echo "Press Ctrl+C to stop"
echo ""
echo "---"

# Watch the run
gh run watch $LATEST_RUN --interval=2
