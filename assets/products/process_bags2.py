from rembg import remove
from PIL import Image
import os

# Define the images we want to clean
bags = ["juteBag1.webp", "JuteBag2.webp", "Jutebag3.webp"]

print("Starting AI background removal...")

for bag_name in bags:
    if os.path.exists(bag_name):
        print(f"Processing {bag_name}...")
        
        # Load the image
        input_img = Image.open(bag_name)
        
        # This is where the heavy ONNX engine you're downloading works its magic
        output_img = remove(input_img)
        
        # Save as high-quality WebP (Best for your site)
        output_name = bag_name.replace(".webp", "_clean.webp")
        output_img.save(output_name, "WEBP", quality=90)
        
        print(f"Finished! Saved as {output_name}")

print("All products are now transparent and ready for the showroom.")