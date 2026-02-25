#!/bin/bash

# Deploy to Google Cloud Run
# ============================

set -e

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-your-project-id}"
REGION="${GOOGLE_CLOUD_REGION:-us-central1}"
SERVICE_NAME="batch-video-renderer"
IMAGE_NAME="batch-video-renderer"
IMAGE_URL="gcr.io/$PROJECT_ID/$IMAGE_NAME"

echo "🚀 Deploying Batch Video Renderer to Google Cloud Run"
echo "======================================================"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud not found. Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
echo "📋 Checking authentication..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated. Run: gcloud auth login"
    exit 1
fi

# Set the project
echo "📋 Setting project..."
gcloud config set project "$PROJECT_ID"

# Enable required APIs
echo "📋 Enabling required APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com

# Build the image
echo "🔨 Building Docker image..."
gcloud builds submit \
    --tag "$IMAGE_URL" \
    --platform "linux/amd64" \
    --timeout "20m"

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --image "$IMAGE_URL" \
    --platform "managed" \
    --region "$REGION" \
    --allow-unauthenticated \
    --memory "2Gi" \
    --cpu "2" \
    --timeout "3600" \
    --max-instances "10" \
    --min-instances "0" \
    --port "8080" \
    --set-env-vars "NODE_ENV=production,REMOTION_OVERTIME=120"

# Get service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --platform "managed" \
    --region "$REGION" \
    --format "value(status.url)")

echo ""
echo "✅ Deployment complete!"
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "📝 Test the deployment:"
echo "   curl $SERVICE_URL/api/health"
echo ""
echo "🎬 Render a video:"
echo "   curl -X POST $SERVICE_URL/render -d '{\"composition\":\"BatchCarousel-Video1\",\"codec\":\"h264\"}'"
