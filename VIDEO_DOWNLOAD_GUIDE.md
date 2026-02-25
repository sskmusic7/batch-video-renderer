# 📥 Video Download Guide

## 🎯 Where Videos Are Downloaded

### **From the Web UI:**
1. **Open your service URL** in browser
2. **Scroll down** to "Rendered Videos" section
3. **Click "🔄 Refresh Videos"** to see latest videos
4. **Click "⬇️ Download"** button next to any video
5. **Videos download** directly to your browser's default download folder (usually `~/Downloads/`)

### **Download Location:**
- **Default**: Your browser's download folder (typically `~/Downloads/` on Mac)
- **You can change this** in your browser settings
- **Videos are named** like: `video1.mp4`, `video2.mp4`, etc.

---

## 🌐 Accessing Videos

### **Option 1: Web UI (Easiest)**
1. Go to your service URL
2. Scroll to "Rendered Videos" section
3. Click download buttons

### **Option 2: Direct URL**
```bash
# Get your service URL
SERVICE_URL=$(gcloud run services describe batch-video-renderer \
  --platform managed \
  --region us-central1 \
  --format "value(status.url)")

# Download video directly
curl -O "$SERVICE_URL/videos/video1.mp4"
```

### **Option 3: API Endpoint**
```bash
# List all videos
curl "$SERVICE_URL/api/videos"

# Download specific video
curl -O "$SERVICE_URL/api/videos/video1.mp4"
```

---

## 📁 Video Storage

### **On the Server:**
- Videos are stored in: `public/videos/` directory
- Automatically copied from `output/batch-videos/` after rendering
- Accessible via HTTP at: `https://YOUR_SERVICE_URL/videos/video1.mp4`

### **On Your Computer:**
- Downloads go to your browser's default download folder
- Usually: `~/Downloads/` on Mac
- You can change this in browser settings

---

## 🔄 Workflow

1. **Upload images** via web UI
2. **Process & render** videos
3. **Wait** for rendering to complete (check status)
4. **Refresh videos list** in web UI
5. **Download** videos to your computer
6. **Videos saved** to `~/Downloads/` (or your browser's download folder)

---

## 💡 Tips

- **Refresh the videos list** after processing to see new videos
- **Videos are kept** on the server until you delete them
- **Large videos** may take time to download
- **Multiple videos** can be downloaded one at a time

---

## 🗑️ Clean Up

To remove videos from the server (free up space):
```bash
# SSH into Cloud Run instance (if needed)
# Or videos will be cleaned up automatically after a period
```

---

**Videos download to your browser's default download folder!**
