# 🚀 GitHub Deployment Guide

## Quick Start

Your batch video renderer is now ready to be pushed to GitHub and deployed remotely!

---

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name it: `batch-video-renderer` (or any name you prefer)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

---

## Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd "/Users/sskmusic/Simple B roll Generator/batch-video-renderer"

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/batch-video-renderer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Alternative: Using SSH (if you have SSH keys set up)**
```bash
git remote add origin git@github.com:YOUR_USERNAME/batch-video-renderer.git
git branch -M main
git push -u origin main
```

---

## Step 3: Remote Deployment Options

Once your code is on GitHub, you have several deployment options:

### Option A: Google Cloud Run (Recommended for Video Rendering)

The project includes automatic deployment to Google Cloud Run via GitHub Actions.

#### Setup:

1. **Create a Google Cloud Project:**
   ```bash
   # Install Google Cloud SDK if you haven't
   # Then authenticate
   gcloud auth login
   gcloud projects create YOUR_PROJECT_ID
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Enable required APIs:**
   ```bash
   gcloud services enable \
     cloudbuild.googleapis.com \
     run.googleapis.com \
     containerregistry.googleapis.com
   ```

3. **Create a Service Account:**
   ```bash
   gcloud iam service-accounts create github-actions \
     --display-name="GitHub Actions Service Account"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/cloudbuild.builds.editor"
   ```

4. **Create and download key:**
   ```bash
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

5. **Add GitHub Secrets:**
   - Go to your GitHub repository
   - Click **Settings** → **Secrets and variables** → **Actions**
   - Click **"New repository secret"**
   - Add these secrets:
     - `GCP_PROJECT_ID`: Your Google Cloud project ID
     - `GCP_SA_KEY`: The entire contents of `key.json` file

6. **Deploy:**
   - Every push to `main` branch will automatically deploy
   - Or manually trigger: **Actions** tab → **Deploy to Google Cloud Run** → **Run workflow**

---

### Option B: GitHub Actions (Self-Hosted Runner)

If you want to run rendering on your own infrastructure:

1. Set up a self-hosted GitHub Actions runner
2. The workflows will automatically use it for rendering

---

### Option C: Manual Remote Execution

You can also SSH into a remote server and run:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/batch-video-renderer.git
cd batch-video-renderer

# Install dependencies
npm install

# Run rendering
./deploy/auto-render-videos.command
```

---

## Step 4: Running Operations Remotely

### Via Google Cloud Run API

Once deployed, you can trigger video rendering via API:

```bash
# Get your service URL from Cloud Run dashboard
SERVICE_URL="https://batch-video-renderer-xxxxx.run.app"

# Render a video
curl -X POST "$SERVICE_URL/render" \
  -H "Content-Type: application/json" \
  -d '{
    "composition": "BatchCarousel-Video1",
    "codec": "h264",
    "output": "video1.mp4"
  }'
```

### Via GitHub Actions Workflow

Create a workflow that triggers on demand:

1. Go to **Actions** tab in GitHub
2. Click **"New workflow"**
3. Use the existing `.github/workflows/deploy-cloudrun.yml` as a template
4. Modify to add a render step

---

## Troubleshooting

### Authentication Issues

```bash
# Re-authenticate with GitHub
git remote set-url origin https://github.com/YOUR_USERNAME/batch-video-renderer.git
git push -u origin main
```

### Large Files

If you have large video files, consider using Git LFS:

```bash
git lfs install
git lfs track "*.mp4"
git add .gitattributes
git commit -m "Add Git LFS tracking"
```

### Permission Issues

Make sure scripts are executable:

```bash
chmod +x deploy/*.sh
chmod +x deploy/*.command
```

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Set up Cloud Run deployment (optional)
3. ✅ Configure GitHub Secrets (for Cloud Run)
4. ✅ Test remote rendering
5. ✅ Set up automated workflows

---

## Useful Commands

```bash
# Check git status
git status

# View remote
git remote -v

# Pull latest changes
git pull origin main

# Push changes
git add .
git commit -m "Your commit message"
git push origin main

# View deployment logs (Cloud Run)
gcloud run services logs read batch-video-renderer --region us-central1
```

---

**Last Updated**: 2025-02-25
