# 🚀 Deployment Guide

## Prerequisites

- Node.js 20+
- Google Cloud SDK (for Cloud Run)
- FFmpeg (for local rendering)
- Python 3 (for OCR)

---

## Google Cloud Run

### Setup

```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash

# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

### Deploy

```bash
./deploy/deploy-cloudrun.sh
```

### Environment Variables

- `GCP_PROJECT_ID` - Your Google Cloud project ID
- `GCP_REGION` - Region (default: us-central1)
- `GIPHY_API_KEY` - Optional, for GIPHY integration

---

## GitHub Pages

### Setup

1. Create GitHub repository
2. Push code
3. Enable Pages in Settings

### Deploy

```bash
git add .
git commit -m "Deploy batch video renderer"
git push origin main
```

---

## Testing

### Local Test

```bash
# Install dependencies
npm install

# Run preview
npx remotion studio

# Render video
npx remotion render BatchCarousel-Video1 output.mp4
```

### Cloud Test

```bash
# Health check
curl https://YOUR_SERVICE_URL/api/health

# Render video
curl -X POST https://YOUR_SERVICE_URL/render \
  -H "Content-Type: application/json" \
  -d '{"composition":"BatchCarousel-Video1"}'
```

---

**Last Updated**: 2025-02-25
