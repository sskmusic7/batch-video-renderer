# 🌐 Web UI Guide - Image Upload Interface

## 🎯 Access the Web Interface

Once your service is deployed, you'll have a **beautiful web UI** for uploading images!

### Get Your Service URL:
```bash
gcloud run services describe batch-video-renderer \
  --platform managed \
  --region us-central1 \
  --format "value(status.url)"
```

Then open that URL in your browser!

---

## ✨ Features

### 🖱️ Drag & Drop Upload
- **Drag images** directly onto the web page
- **Or click** to browse and select files
- **Preview** all selected images before uploading
- **Remove** individual images if needed

### 📤 Upload Process
1. Select or drag images onto the upload area
2. Click **"Upload Images"** button
3. Images are uploaded to the service
4. Ready for processing!

### 🎬 Video Rendering
1. After uploading images, click **"Process & Render Videos"**
2. Service processes images in batches of 4
3. Videos are rendered automatically
4. Download when complete

---

## 📁 Alternative: Google Drive

### Option 1: Use the Web UI (Recommended)
- Just drag images from your computer
- No Google Drive setup needed
- Works directly in browser

### Option 2: Google Drive Integration
If you want to sync from Google Drive:

1. **Install gdrive CLI:**
```bash
brew install gdrive  # macOS
# or download from: https://github.com/glotlabs/gdrive/releases
```

2. **Authenticate:**
```bash
gdrive about
```

3. **Upload images to Drive:**
```bash
# Upload folder to Google Drive
gdrive upload --recursive ~/Downloads/SSK/
```

4. **Then use the web UI** to download from Drive and upload to service

---

## 🎨 Web UI Screenshots

The interface includes:
- ✨ Modern, gradient design
- 📸 Image preview grid
- 🎯 Drag & drop zone
- ✅ Status notifications
- 🔄 Loading indicators

---

## 🚀 Quick Start

1. **Deploy service** (automatic via GitHub Actions)
2. **Get service URL** (from Cloud Run console or CLI)
3. **Open URL** in browser
4. **Drag & drop images**
5. **Click "Upload Images"**
6. **Click "Process & Render Videos"**
7. **Done!** 🎉

---

## 💡 Tips

- **Supported formats**: PNG, JPG, JPEG
- **Batch size**: 4 images per video
- **Multiple uploads**: Upload as many as you want
- **Remove images**: Click × on any preview to remove

---

**The web UI is automatically deployed with your service!**
