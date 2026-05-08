import os
from rembg import remove
from PIL import Image
import io

def process_target_images(target_files, target_width=1600):
    for filename in target_files:
        if not os.path.exists(filename):
            print(f"File not found: {filename}")
            continue

        print(f" Processing {filename}...")
        output_filename = os.path.splitext(filename)[0] + "_web.webp"
        
        # 1. Background Removal
        with open(filename, 'rb') as i:
            input_data = i.read()
            subject_only = remove(input_data)
        
        # 2. Open with PIL and handle transparency
        img = Image.open(io.BytesIO(subject_only))
        
        # 3. Resize if too massive (maintaining high quality for animations)
        if img.width > target_width:
            ratio = target_width / float(img.width)
            target_height = int(float(img.height) * float(ratio))
            img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
            print(f"📏 Resized {filename} to {target_width}px width.")

        # 4. Save as Optimized WebP with Alpha Channel
        # Method 6 + Quality 85 is perfect for Jute texture
        img.save(output_filename, "WEBP", quality=85, method=6)
        
        size_mb = os.path.getsize(output_filename) / (1024 * 1024)
        print(f"Success: {output_filename} ({size_mb:.2f} MB)")

if __name__ == "__main__":
    # Defining your two specific targets
    targets = ["JuteBag2.jpg", "JuteBag2Decon.png"]
    process_target_images(targets)