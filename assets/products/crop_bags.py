from PIL import Image

# Load your transparent decon image
img = Image.open("JuteBag2Decon_web.webp")

# Coordinates: (left, top, right, bottom)
# Note: You may need to tweak these numbers slightly based on the exact pixel layout
parts = {
    "flap": (180, 50, 580, 520),
    "body": (180, 540, 590, 960),
    "strap": (620, 70, 880, 850)
}

for name, box in parts.items():
    crop = img.crop(box)
    crop.save(f"juteBag2_{name}.webp", "WEBP", quality=90)
    print(f"✅ Exported: juteBag2_{name}.webp")