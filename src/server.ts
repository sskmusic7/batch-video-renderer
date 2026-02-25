import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);
const app = express();
const upload = multer({ dest: '/tmp/uploads/' });

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Upload images endpoint
app.post('/api/upload', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const files = Array.isArray(req.files) ? req.files : [req.files];
    const batchDir = path.join(process.cwd(), 'public', 'batch-images');
    
    // Ensure directory exists
    if (!fs.existsSync(batchDir)) {
      fs.mkdirSync(batchDir, { recursive: true });
    }

    // Copy uploaded files to batch-images directory
    const copiedFiles: string[] = [];
    for (const file of files) {
      const destPath = path.join(batchDir, file.originalname);
      fs.copyFileSync(file.path, destPath);
      copiedFiles.push(destPath);
      // Clean up temp file
      fs.unlinkSync(file.path);
    }

    res.json({ 
      success: true, 
      message: `Uploaded ${copiedFiles.length} images`,
      files: copiedFiles.map(f => path.basename(f))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Process images and render videos
app.post('/api/process', async (req, res) => {
  try {
    const batchDir = path.join(process.cwd(), 'public', 'batch-images');
    
    if (!fs.existsSync(batchDir)) {
      return res.status(400).json({ error: 'No images found. Upload images first.' });
    }

    // Run the render script
    const scriptPath = path.join(process.cwd(), 'deploy', 'auto-render-videos.command');
    
    res.json({ 
      success: true, 
      message: 'Processing started',
      note: 'Check logs for progress'
    });

    // Run processing in background
    execAsync(`chmod +x "${scriptPath}" && "${scriptPath}"`, {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 10 // 10MB
    }).catch(err => {
      console.error('Processing error:', err);
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Render specific video
app.post('/api/render', async (req, res) => {
  try {
    const { composition, codec = 'h264' } = req.body;
    
    if (!composition) {
      return res.status(400).json({ error: 'Composition ID required' });
    }

    const outputPath = `/tmp/${composition}-${Date.now()}.mp4`;
    
    res.json({ 
      success: true, 
      message: 'Rendering started',
      composition,
      outputPath
    });

    // Render in background
    execAsync(`npx remotion render ${composition} ${outputPath} --codec=${codec}`, {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 10
    }).catch(err => {
      console.error('Render error:', err);
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List available compositions
app.get('/api/compositions', (req, res) => {
  res.json({
    compositions: [
      { id: 'BatchCarousel-Video1', name: 'Batch Carousel Video 1' },
      { id: 'BatchCarousel-Video2', name: 'Batch Carousel Video 2' },
      { id: 'BatchCarousel-Video3', name: 'Batch Carousel Video 3' },
      { id: 'BatchCarousel-Video4', name: 'Batch Carousel Video 4' },
      { id: 'BatchCarousel-Video5', name: 'Batch Carousel Video 5' },
    ]
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
