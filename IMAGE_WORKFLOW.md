# 📸 Image Processing Workflow

## 🎯 How to Process Images Remotely

### **We're using GitHub Actions + Cloud Run, NOT Google App Scripts**

The system uses:
- **GitHub Actions** for CI/CD
- **Google Cloud Run** for the API server
- **Google Cloud Storage** (optional) for image storage

---

## 📁 Where to Drop Images

### Option 1: Local Folder (Default)
**Drop images here:**
```
~/Downloads/SSK/
```

Then run locally:
```bash
cd "/Users/sskmusic/Simple B roll Generator/batch-video-renderer"
./deploy/auto-render-videos.command
```

### Option 2: Upload to Remote Service (Recommended)
Once the service is deployed:

1. **Upload images via API:**
```bash
# Upload single image
curl -X POST https://YOUR_SERVICE_URL/api/upload \
  -F "images=@/path/to/image.png"

# Upload multiple images
curl -X POST https://YOUR_SERVICE_URL/api/upload \
  -F "images=@image1.png" \
  -F "images=@image2.png" \
  -F "images=@image3.png"
```

2. **Or use the upload script:**
```bash
./scripts/upload-images.sh ~/Downloads/SSK/*.png
```

3. **Process and render:**
```bash
curl -X POST https://YOUR_SERVICE_URL/api/process
```

### Option 3: Google Cloud Storage (For Large Batches)
1. **Set up bucket:**
```bash
./scripts/setup-image-upload.sh
```

2. **Upload images:**
```bash
gsutil cp ~/Downloads/SSK/*.png gs://batch-video-renderer-images-PROJECT_ID/uploads/
```

3. **Process via API** (service will download from GCS)

---

## 🚀 Quick Start

### Step 1: Get Service URL
```bash
gcloud run services describe batch-video-renderer \
  --platform managed \
  --region us-central1 \
  --format "value(status.url)"
```

### Step 2: Upload Images
```bash
# Using the script
./scripts/upload-images.sh ~/Downloads/SSK/*.png

# Or manually
SERVICE_URL="https://batch-video-renderer-xxxxx.run.app"
curl -X POST "$SERVICE_URL/api/upload" \
  -F "images=@image1.png" \
  -F "images=@image2.png"
```

### Step 3: Process & Render
```bash
curl -X POST "$SERVICE_URL/api/process"
```

### Step 4: Check Status
```bash
curl "$SERVICE_URL/api/health"
```

---

## 📊 Monitor Deployment

### Live Terminal Stream:
```bash
./scripts/monitor-deployment.sh
```

### Or manually:
```bash
gh run watch $(gh run list --workflow=deploy-cloudrun.yml --limit 1 --json databaseId --jq '.[0].databaseId')
```

---

## 🔄 Complete Workflow

1. **Drop images** in `~/Downloads/SSK/` (or any folder)
2. **Upload to service:**
   ```bash
   ./scripts/upload-images.sh ~/Downloads/SSK/*.png
   ```
3. **Trigger processing:**
   ```bash
   SERVICE_URL=$(gcloud run services describe batch-video-renderer --platform managed --region us-central1 --format "value(status.url)")
   curl -X POST "$SERVICE_URL/api/process"
   ```
4. **Videos are rendered** on Cloud Run
5. **Download videos** from the service

---

## 🛠️ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/upload` | POST | Upload images (multipart/form-data) |
| `/api/process` | POST | Process uploaded images and render videos |
| `/api/render` | POST | Render specific composition |
| `/api/compositions` | GET | List available compositions |

---

## 💡 Notes

- **No Google App Scripts** - We use Cloud Run API
- Images are processed in batches of 4 per video
- Videos are rendered using Remotion
- Service scales automatically based on load
- All processing happens remotely on Google Cloud

---

**Last Updated**: 2026-02-25
