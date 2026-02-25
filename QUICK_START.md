# 🚀 Quick Start Guide

## 📊 Live Deployment Monitor

**Watch deployment progress in terminal:**
```bash
cd "/Users/sskmusic/Simple B roll Generator/batch-video-renderer"
./scripts/monitor-deployment.sh
```

**Or manually:**
```bash
gh run watch $(gh run list --workflow=deploy-cloudrun.yml --limit 1 --json databaseId --jq '.[0].databaseId')
```

---

## 📸 Where to Drop Images

### **We're using GitHub Actions + Cloud Run, NOT Google App Scripts!**

### Option 1: Local Processing (Default)
**Drop images here:**
```
~/Downloads/SSK/
```

Then run:
```bash
cd "/Users/sskmusic/Simple B roll Generator/batch-video-renderer"
./deploy/auto-render-videos.command
```

### Option 2: Remote Upload (Once Service is Deployed)

1. **Get service URL:**
```bash
gcloud run services describe batch-video-renderer \
  --platform managed \
  --region us-central1 \
  --format "value(status.url)"
```

2. **Upload images:**
```bash
# Using the script
./scripts/upload-images.sh ~/Downloads/SSK/*.png

# Or manually
SERVICE_URL="https://batch-video-renderer-xxxxx.run.app"
curl -X POST "$SERVICE_URL/api/upload" \
  -F "images=@image1.png" \
  -F "images=@image2.png"
```

3. **Process & render:**
```bash
curl -X POST "$SERVICE_URL/api/process"
```

---

## 🔄 Complete Workflow

1. **Drop images** → `~/Downloads/SSK/`
2. **Upload to service** → `./scripts/upload-images.sh ~/Downloads/SSK/*.png`
3. **Process** → `curl -X POST "$SERVICE_URL/api/process"`
4. **Download videos** from service

---

## 📋 Current Status

- ✅ GitHub repository: https://github.com/sskmusic7/batch-video-renderer
- ✅ Google Cloud project: `eminent-century-464801-b0`
- ✅ Service account configured
- ✅ GitHub secrets set
- ✅ GCS bucket created: `batch-video-renderer-images-eminent-century-464801-b0`
- 🔄 Deployment in progress (check monitor script)

---

## 🛠️ Useful Commands

```bash
# Monitor deployment
./scripts/monitor-deployment.sh

# Upload images
./scripts/upload-images.sh ~/path/to/images/*.png

# Setup GCS bucket (already done)
./scripts/setup-image-upload.sh

# Check service status
gcloud run services describe batch-video-renderer --platform managed --region us-central1

# View logs
gh run list --workflow=deploy-cloudrun.yml
```

---

**See `IMAGE_WORKFLOW.md` for detailed workflow instructions!**
