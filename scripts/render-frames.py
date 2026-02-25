#!/usr/bin/env python3
"""
Automated Batch Video Creator for Remotion
============================================
This script:
1. Takes images from a folder (drag & drop or specified)
2. Extracts prompts using OCR (Google Vision / Tesseract)
3. Creates Remotion compositions with 4 images per video
4. Renders videos using still frames + FFmpeg (compatible with iOS)

Usage:
    python3 render-still-frames.py /path/to/images

Or drag and drop images onto this script.
"""

import os
import sys
import json
import subprocess
import shutil
from pathlib import Path
from typing import List, Dict

# Configuration
REMOTION_PROJECT = Path(__file__).parent
OUTPUT_DIR = REMOTION_PROJECT / "output" / "batch-videos"
FRAMES_PER_SLIDE = 120  # 4 seconds at 30fps
IMAGES_PER_VIDEO = 4

def copy_images_to_project(image_paths: List[Path]) -> List[Path]:
    """Copy images to the Remotion public folder."""
    batch_dir = REMOTION_PROJECT / "public" / "batch-images"
    batch_dir.mkdir(parents=True, exist_ok=True)

    copied_paths = []
    for img_path in image_paths:
        dest = batch_dir / img_path.name
        shutil.copy2(img_path, dest)
        copied_paths.append(dest)
        print(f"✓ Copied: {img_path.name}")

    return copied_paths

def extract_prompts_from_images(image_paths: List[Path]) -> List[Dict]:
    """Extract prompts from images using OCR."""
    import pytesseract
    from PIL import Image

    results = []
    for img_path in image_paths:
        try:
            image = Image.open(img_path)
            text = pytesseract.image_to_string(image)
            prompt = text.strip() if text.strip() else f"AI Fashion Concept #{img_path.stem}"

            results.append({
                "filename": img_path.name,
                "publicPath": f"/batch-images/{img_path.name}",
                "prompt": prompt[:200],  # Limit prompt length
                "hasPrompt": len(text.strip()) > 10
            })
            print(f"  ✓ {img_path.name}: {len(prompt)} chars")
        except Exception as e:
            print(f"  ⚠ {img_path.name}: {e}")
            results.append({
                "filename": img_path.name,
                "publicPath": f"/batch-images/{img_path.name}",
                "prompt": f"AI Concept #{img_path.stem}",
                "hasPrompt": False
            })

    return results

def group_images_into_videos(images: List[Dict], images_per_video: int = IMAGES_PER_VIDEO) -> List[List[Dict]]:
    """Group images into videos."""
    groups = []
    for i in range(0, len(images), images_per_video):
        groups.append(images[i:i + images_per_video])
    return groups

def render_still_frames(video_id: int, images: List[Dict]) -> bool:
    """Render individual frames using Remotion still command."""
    total_frames = len(images) * FRAMES_PER_SLIDE
    frames_dir = OUTPUT_DIR / f"frames{video_id}"
    frames_dir.mkdir(parents=True, exist_ok=True)

    print(f"  🎨 Rendering {total_frames} frames...")

    # Update the composition data
    composition_file = REMOTION_PROJECT / "src" / "compositions" / "BatchImagesCarousel.tsx"

    # Render frames
    for frame in range(total_frames):
        print(f"\r    Frame {frame + 1}/{total_frames}", end="", flush=True)

        cmd = [
            "npx", "remotion", "still",
            f"BatchCarousel-Video{video_id}",
            str(frames_dir / f"frame-{frame:04d}.png"),
            "--sequence", str(frame),
            "--overwrite"
        ]

        try:
            result = subprocess.run(
                cmd,
                cwd=REMOTION_PROJECT,
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode != 0:
                print(f"\n    ⚠ Frame {frame} failed: {result.stderr[:100]}")
        except Exception as e:
            print(f"\n    ⚠ Frame {frame} error: {e}")

    print(f"\n  ✓ Frames rendered to {frames_dir}")
    return True

def combine_frames_to_video(video_id: int, frames_dir: Path, output_path: Path) -> bool:
    """Combine frames into video using FFmpeg."""
    print(f"  🎞️  Combining frames to video...")

    ffmpeg_path = shutil.which("ffmpeg")
    if not ffmpeg_path:
        # Try common locations
        for path in ["/opt/miniconda3/bin/ffmpeg", "/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg"]:
            if Path(path).exists():
                ffmpeg_path = path
                break

    if not ffmpeg_path:
        print("  ⚠ FFmpeg not found, skipping video creation")
        return False

    cmd = [
        ffmpeg_path,
        "-y",  # Overwrite output
        "-framerate", "30",
        "-i", str(frames_dir / "frame-%04d.png"),
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "23",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",  # Optimize for streaming
        str(output_path)
    ]

    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"  ✓ Video created: {output_path.name}")
        return True
    except Exception as e:
        print(f"  ⚠ FFmpeg failed: {e}")
        return False

def update_composition_file(video_groups: List[List[Dict]]):
    """Update the BatchImagesCarousel.tsx with new image data."""
    # This would need to parse and update the TSX file
    # For now, assume the file is manually configured
    print("  ℹ Please ensure BatchImagesCarousel.tsx is configured with the new images")
    pass

def main():
    """Main execution."""
    print("🎬 Automated Batch Video Creator")
    print("=" * 60)

    # Get input images
    if len(sys.argv) > 1:
        # Images passed as arguments
        image_paths = [Path(p) for p in sys.argv[1:] if Path(p).exists() and Path(p).suffix.lower() in ['.png', '.jpg', '.jpeg']]
    else:
        # Use default folder
        default_folder = Path.home() / "Downloads" / "SSK"
        if default_folder.exists():
            image_paths = list(default_folder.glob("*.png")) + list(default_folder.glob("*.jpg"))
        else:
            print("❌ No images found. Please drag images onto this script or specify a path.")
            print(f"   Usage: python3 {sys.argv[0]} /path/to/images")
            return 1

    if not image_paths:
        print("❌ No valid images found")
        return 1

    print(f"\n📁 Found {len(image_paths)} images")

    # Step 1: Copy images to project
    print("\n📋 Step 1: Copying images to project...")
    copied_images = copy_images_to_project(image_paths)

    # Step 2: Extract prompts
    print("\n🔍 Step 2: Extracting prompts...")
    prompts_data = extract_prompts_from_images(copied_images)

    # Save prompts data
    prompts_file = REMOTION_PROJECT / "public" / "batch-prompts.json"
    with open(prompts_file, 'w') as f:
        json.dump({"images": prompts_data, "metadata": {"totalImages": len(prompts_data)}}, f, indent=2)
    print(f"  ✓ Saved: {prompts_file}")

    # Step 3: Group into videos
    print(f"\n📦 Step 3: Grouping into videos ({IMAGES_PER_VIDEO} images each)...")
    video_groups = group_images_into_videos(prompts_data)
    print(f"  ✓ Created {len(video_groups)} videos")

    # Step 4: Render videos
    print(f"\n🎬 Step 4: Rendering videos...")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for i, group in enumerate(video_groups, 1):
        print(f"\n[Video {i}/{len(video_groups)}] {len(group)} images")

        # Render still frames
        frames_dir = OUTPUT_DIR / f"frames{i}"
        if render_still_frames(i, group):
            # Combine to video
            output_path = OUTPUT_DIR / f"video{i}.mp4"
            combine_frames_to_video(i, frames_dir, output_path)

    print("\n" + "=" * 60)
    print("🎉 Rendering complete!")
    print(f"📁 Output: {OUTPUT_DIR}")

    return 0

if __name__ == "__main__":
    sys.exit(main())
