#!/bin/bash
# Upload images to the deployed service

set -e

# Get service URL
SERVICE_URL=$(gcloud run services describe batch-video-renderer \
  --platform managed \
  --region us-central1 \
  --format "value(status.url)" 2>/dev/null)

if [ -z "$SERVICE_URL" ]; then
    echo "❌ Service not found. Is it deployed?"
    echo "   Run: ./scripts/setup-image-upload.sh first"
    exit 1
fi

# Get images from command line or use default folder
if [ $# -eq 0 ]; then
    IMAGE_DIR="$HOME/Downloads/SSK"
    if [ ! -d "$IMAGE_DIR" ]; then
        echo "❌ No images provided and default folder not found: $IMAGE_DIR"
        echo ""
        echo "Usage: $0 [image1.png] [image2.png] ..."
        echo "   Or: $0 /path/to/images/"
        echo "   Or: Place images in $IMAGE_DIR"
        exit 1
    fi
    IMAGES=("$IMAGE_DIR"/*.{png,jpg,jpeg} 2>/dev/null)
else
    IMAGES=("$@")
fi

echo "📤 Uploading images to: $SERVICE_URL"
echo ""

# Upload using curl
for img in "${IMAGES[@]}"; do
    if [ -f "$img" ]; then
        echo "Uploading: $(basename "$img")"
        curl -X POST "$SERVICE_URL/api/upload" \
            -F "images=@$img" \
            -H "Content-Type: multipart/form-data" \
            --silent --show-error | jq '.' || echo "Uploaded: $(basename "$img")"
    fi
done

echo ""
echo "✅ Upload complete!"
echo ""
echo "🎬 To process images and render videos:"
echo "   curl -X POST $SERVICE_URL/api/process"
