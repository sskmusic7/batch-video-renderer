#!/bin/bash
# Setup Google Cloud Storage bucket for image uploads

set -e

PROJECT_ID=$(gcloud config get-value project)
BUCKET_NAME="batch-video-renderer-images-${PROJECT_ID}"
REGION="us-central1"

echo "📦 Setting up image upload bucket..."
echo "Project: $PROJECT_ID"
echo "Bucket: $BUCKET_NAME"
echo ""

# Create bucket
echo "Creating GCS bucket..."
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION "gs://$BUCKET_NAME" 2>&1 || echo "Bucket may already exist"

# Set public read (for images)
echo "Setting bucket permissions..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Create upload folder structure
echo "Creating folder structure..."
gsutil -m mkdir -p gs://$BUCKET_NAME/uploads/
gsutil -m mkdir -p gs://$BUCKET_NAME/processed/

echo ""
echo "✅ Bucket setup complete!"
echo ""
echo "📁 Upload images to:"
echo "   gs://$BUCKET_NAME/uploads/"
echo ""
echo "💡 To upload images:"
echo "   gsutil cp /path/to/images/*.png gs://$BUCKET_NAME/uploads/"
echo ""
echo "💡 Or use the web UI:"
echo "   https://console.cloud.google.com/storage/browser/$BUCKET_NAME?project=$PROJECT_ID"
