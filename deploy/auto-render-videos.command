#!/bin/bash

# ================================================================
# Auto Batch Video Renderer - Drag & Drop Executable
# ================================================================
# This script automatically:
# 1. Accepts dragged images or uses Downloads/SSK folder
# 2. Extracts prompts using OCR
# 3. Groups images (4 per video)
# 4. Renders videos using still frames + FFmpeg (iOS compatible)
#
# Usage:
#   - Double-click to run (uses Downloads/SSK folder)
#   - Drag & drop images onto this script
#   - Run: ./auto-render-videos.command /path/to/images
# ================================================================

set -e

# Configuration - paths are relative to script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$PROJECT_DIR/output/batch-videos"
IMAGES_PER_VIDEO=4
FRAMES_PER_SLIDE=120
FPS=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

print_header() {
    echo ""
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     Automated Batch Video Renderer for Remotion      ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Get input images
get_input_images() {
    local images=()

    if [ $# -gt 0 ]; then
        # Images passed as arguments (drag & drop)
        for arg in "$@"; do
            if [ -f "$arg" ]; then
                case "$arg" in
                    *.png|*.jpg|*.jpeg|*.PNG|*.JPG|*.JPEG)
                        images+=("$arg")
                        ;;
                esac
            elif [ -d "$arg" ]; then
                # Directory passed - add all images
                while IFS= read -r -d '' img; do
                    images+=("$img")
                done < <(find "$arg" -maxdepth 1 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)
            fi
        done
    else
        # Use default folder
        local default_folder="$HOME/Downloads/SSK"
        if [ -d "$default_folder" ]; then
            log_info "Using default folder: $default_folder"
            while IFS= read -r -d '' img; do
                images+=("$img")
            done < <(find "$default_folder" -maxdepth 1 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)
        else
            log_error "No images found"
            log_info "Usage: $0 [image files or folders]"
            log_info "       Or drag & drop images onto this script"
            exit 1
        fi
    fi

    # Sort images
    IFS=$'\n' images=($(sort <<<"${images[*]}"))
    unset IFS

    printf '%s\n' "${images[@]}"
}

# Copy images to project
copy_images() {
    local images=("$@")
    local batch_dir="$PROJECT_DIR/public/batch-images"
    mkdir -p "$batch_dir"

    log_info "Copying images to project..."

    for img in "${images[@]}"; do
        local filename=$(basename "$img")
        cp "$img" "$batch_dir/$filename"
        log_success "Copied: $filename"
    done
}

# Extract prompts using OCR
extract_prompts() {
    log_info "Extracting prompts using OCR..."

    # Run Python OCR script
    if [ -f "$PROJECT_DIR/scripts/extract-prompts.py" ]; then
        python3 "$PROJECT_DIR/scripts/extract-prompts.py"
    else
        log_warning "OCR script not found, using generic prompts"
    fi
}

# Render still frames
render_frames() {
    local video_id=$1
    local num_images=$2
    local total_frames=$((num_images * FRAMES_PER_SLIDE))
    local frames_dir="$OUTPUT_DIR/frames$video_id"

    mkdir -p "$frames_dir"

    log_info "Rendering $total_frames frames..."

    cd "$PROJECT_DIR"

    for frame in $(seq 0 $((total_frames - 1))); do
        printf "\r  Frame $((frame + 1))/$total_frames"

        npx remotion still "BatchCarousel-Video$video_id" \
            "$frames_dir/frame-$(printf '%04d' $frame).png" \
            --sequence="$frame" \
            --overwrite \
            > /dev/null 2>&1 || true
    done

    printf "\r"
    log_success "Rendered $total_frames frames"
}

# Combine frames to video
combine_to_video() {
    local video_id=$1
    local frames_dir="$OUTPUT_DIR/frames$video_id"
    local output_file="$OUTPUT_DIR/video$video_id.mp4"

    log_info "Combining frames to video..."

    # Find FFmpeg
    local ffmpeg=""
    for path in \
        "/opt/miniconda3/bin/ffmpeg" \
        "/opt/homebrew/bin/ffmpeg" \
        "/usr/local/bin/ffmpeg" \
        "$(which ffmpeg)"
    do
        if [ -x "$path" ]; then
            ffmpeg="$path"
            break
        fi
    done

    if [ -z "$ffmpeg" ]; then
        log_error "FFmpeg not found"
        return 1
    fi

    "$ffmpeg" -y \
        -framerate $FPS \
        -i "$frames_dir/frame-%04d.png" \
        -c:v libx264 \
        -preset medium \
        -crf 23 \
        -pix_fmt yuv420p \
        -movflags +faststart \
        "$output_file" \
        -loglevel error

    log_success "Created: video$video_id.mp4"
}

# Main execution
main() {
    cd "$PROJECT_DIR"

    print_header

    # Get images
    log_info "Finding images..."
    images=($(get_input_images "$@"))

    if [ ${#images[@]} -eq 0 ]; then
        log_error "No images found"
        exit 1
    fi

    log_success "Found ${#images[@]} images"

    # Copy images
    copy_images "${images[@]}"

    # Extract prompts
    extract_prompts

    # Calculate videos
    num_videos=$(( (${#images[@]} + IMAGES_PER_VIDEO - 1) / IMAGES_PER_VIDEO ))

    log_info "Creating $num_videos videos ($IMAGES_PER_VIDEO images each)"

    mkdir -p "$OUTPUT_DIR"

    # Render each video
    for i in $(seq 1 $num_videos); do
        echo ""
        log_info "Processing video $i/$num_videos..."

        # Calculate images in this video
        start_idx=$(((i - 1) * IMAGES_PER_VIDEO))
        end_idx=$((start_idx + IMAGES_PER_VIDEO - 1))
        if [ $end_idx -ge ${#images[@]} ]; then
            end_idx=$((${#images[@]} - 1))
        fi
        num_images=$((end_idx - start_idx + 1))

        # Render frames
        render_frames $i $num_images

        # Combine to video
        combine_to_video $i
    done

    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                   ✅ COMPLETE!                        ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_info "Output: $OUTPUT_DIR"
    echo ""

    ls -lh "$OUTPUT_DIR"/*.mp4 2>/dev/null || log_warning "No videos created"
}

# Run main
main "$@"
