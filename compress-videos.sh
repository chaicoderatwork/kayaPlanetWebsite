#!/bin/bash

# Compress videos for web using FFmpeg
# Target: ~1-2MB per video, 720p, good quality

cd /Users/rashika2812/kayaPlanetWebsite/public/videos

for file in reel*.mp4; do
    if [ -f "$file" ]; then
        output="${file%.mp4}_compressed.mp4"
        echo "Compressing $file..."
        
        # Compress to 720p, CRF 28 (good balance of quality/size), fast encoding
        ffmpeg -i "$file" \
            -vf "scale=-2:720" \
            -c:v libx264 \
            -crf 28 \
            -preset fast \
            -c:a aac \
            -b:a 128k \
            -movflags +faststart \
            -y \
            "$output"
        
        # Replace original with compressed
        mv "$output" "$file"
        echo "Done: $file"
    fi
done

echo "All videos compressed!"
ls -lah *.mp4
