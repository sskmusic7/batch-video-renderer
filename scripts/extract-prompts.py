#!/usr/bin/env python3
"""
Extract prompts from images using Google Cloud Vision API or Tesseract OCR

This script processes batch images and extracts text/prompts from them.
"""

import os
import sys
import json
from pathlib import Path
from typing import Dict, List, Optional

# Configuration
IMAGE_DIR = Path(__file__).parent.parent / "public" / "batch-images"
OUTPUT_FILE = Path(__file__).parent.parent / "public" / "batch-prompts.json"

def extract_text_tesseract(image_path: Path) -> str:
    """Extract text from image using Tesseract OCR."""
    try:
        import pytesseract
        from PIL import Image

        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text.strip()
    except ImportError:
        print("❌ pytesseract or PIL not installed. Run: pip install pytesseract Pillow")
        return ""
    except Exception as e:
        print(f"❌ Tesseract error for {image_path.name}: {e}")
        return ""

def extract_text_google_vision(image_path: Path) -> str:
    """Extract text from image using Google Cloud Vision API."""
    try:
        from google.cloud import vision
        from google.cloud.vision import types

        client = vision.ImageAnnotatorClient()

        with open(image_path, "rb") as image_file:
            content = image_file.read()

        image = vision.Image(content=content)
        response = client.text_detection(image=image)
        texts = response.text_annotations

        if texts:
            return texts[0].description.strip()
        return ""
    except ImportError:
        print("❌ Google Cloud Vision not installed. Run: pip install google-cloud-vision")
        return ""
    except Exception as e:
        print(f"❌ Google Vision error for {image_path.name}: {e}")
        return ""

def clean_prompt_text(text: str) -> str:
    """Clean and format extracted prompt text."""
    if not text:
        return ""

    # Remove extra whitespace
    text = ' '.join(text.split())

    # Remove common OCR artifacts
    artifacts = [
        '\\n+', '\\r+', '\\t+', '\\s{2,}',
        '©.*?\\d{4}',
        'midjourney',
        'dall.?e',
        'stable.?diffusion',
    ]

    import re
    for artifact in artifacts:
        text = re.sub(artifact, ' ', text, flags=re.IGNORECASE)

    # Clean up again
    text = ' '.join(text.split())

    # Truncate if too long (keep first 500 chars)
    if len(text) > 500:
        text = text[:500] + "..."

    return text.strip()

def extract_prompt_from_filename(filename: str) -> Optional[str]:
    """Try to extract prompt info from filename pattern."""
    # Pattern: [Image: source: /path/to/batch-image-XX.png]
    # This would have been saved in the image metadata or separate file
    return None

def main():
    """Main execution function."""
    print("🔍 Extracting prompts from batch images...")

    if not IMAGE_DIR.exists():
        print(f"❌ Image directory not found: {IMAGE_DIR}")
        return 1

    # Get all PNG images
    images = sorted(IMAGE_DIR.glob("*.png"))
    print(f"📁 Found {len(images)} images")

    if len(images) == 0:
        print("❌ No PNG images found in directory")
        return 1

    results = []

    # Try Google Vision first, fall back to Tesseract
    use_google_vision = True

    for i, image_path in enumerate(images):
        print(f"\n[{i+1}/{len(images)}] Processing: {image_path.name}")

        # Extract text using Google Vision or Tesseract
        if use_google_vision:
            text = extract_text_google_vision(image_path)
            if not text:
                print("  ⚠️  Google Vision failed, trying Tesseract...")
                text = extract_text_tesseract(image_path)
        else:
            text = extract_text_tesseract(image_path)

        # Clean the text
        prompt_text = clean_prompt_text(text)

        # Create result entry
        result = {
            "filename": image_path.name,
            "publicPath": f"/batch-images/{image_path.name}",
            "prompt": prompt_text if prompt_text else "No text detected",
            "hasPrompt": len(prompt_text) > 10 if prompt_text else False,
            "index": i,
        }

        results.append(result)

        status = "✓" if result["hasPrompt"] else "⚠"
        print(f"  {status} Extracted {len(prompt_text)} characters")

    # Create output
    output_data = {
        "images": results,
        "metadata": {
            "totalImages": len(results),
            "imagesWithPrompts": sum(1 for r in results if r["hasPrompt"]),
            "sourceDirectory": str(IMAGE_DIR),
        }
    }

    # Save to JSON
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(output_data, f, indent=2)

    print(f"\n✅ Saved results to: {OUTPUT_FILE}")

    # Print summary
    print("\n" + "=" * 60)
    print("EXTRACTION SUMMARY")
    print("=" * 60)
    print(f"Total images: {len(results)}")
    print(f"With prompts: {sum(1 for r in results if r['hasPrompt'])}")
    print(f"Without prompts: {sum(1 for r in results if not r['hasPrompt'])}")

    # Show first few prompts
    print("\n📝 Sample prompts:")
    for r in results[:3]:
        if r["hasPrompt"]:
            preview = r["prompt"][:100] + "..." if len(r["prompt"]) > 100 else r["prompt"]
            print(f"\n  {r['filename']}:")
            print(f"  {preview}")

    return 0

if __name__ == "__main__":
    sys.exit(main())
