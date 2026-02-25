# 📁 Batch Video Renderer - Structure Guide

## Project Location

```
/Users/sskmusic/Simple B roll Generator/batch-video-renderer
```

**← Open this folder in Cursor!**

---

## Folder Structure

```
batch-video-renderer/
│
├── 📚 docs/                    # Documentation
│   └── (coming soon)
│
├── 🚀 deploy/                  # Executables & Deployment
│   ├── auto-render-videos.command  ← MAIN SCRIPT
│   └── deploy-cloudrun.sh
│
├── 🔧 scripts/                 # Automation
│   ├── extract-prompts.py     ← OCR script
│   └── render-frames.py
│
├── 💻 src/                     # Source Code
│   ├── Root.tsx
│   ├── index.ts
│   └── compositions/
│       └── BatchImagesCarousel.tsx  ← Video template
│
├── 📦 public/                  # Assets
│   ├── batch-images/          ← Your images go here
│   ├── batch-prompts.json     ← Extracted prompts
│   └── backgrounds/           ← Newspaper backgrounds
│
├── .github/workflows/          # CI/CD
│   ├── deploy.yml             ← GitHub Pages
│   └── deploy-cloudrun.yml     ← Cloud Run
│
├── output/                    # Rendered videos
├── Dockerfile                 ← Container image
├── package.json
└── README.md
```

---

## 🎯 Quick Commands

```bash
# Navigate to project
cd "/Users/sskmusic/Simple B roll Generator/batch-video-renderer"

# Install dependencies
npm install

# Run automation
./deploy/auto-render-videos.command

# Preview
npx remotion studio

# Deploy to Cloud Run
./deploy/deploy-cloudrun.sh
```

---

## 📝 File Locations

| What | Where |
|------|-------|
| **Main Executable** | `deploy/auto-render-videos.command` |
| **Video Template** | `src/compositions/BatchImagesCarousel.tsx` |
| **OCR Script** | `scripts/extract-prompts.py` |
| **Cloud Deploy** | `deploy/deploy-cloudrun.sh` |
| **Input Images** | `public/batch-images/` |
| **Output Videos** | `output/batch-videos/` |

---

## 🚀 Deployment

### Google Cloud Run
```bash
./deploy/deploy-cloudrun.sh
```

### GitHub Pages
Push to `main` branch → automatic deployment

---

## ✅ What Makes This Clean

- **Self-contained** - No dependencies on parent project
- **Focused** - Only batch video renderer files
- **Ready to deploy** - Docker, CI/CD included
- **Easy to move** - Can copy/paste anywhere
- **Clear structure** - Everything organized

---

**Last Updated**: 2025-02-25
