import os
import glob

from PIL import Image
import pillow_avif

BASE_PATH = os.path.dirname(os.path.abspath(__file__))

FILE_PATH = []
FILE_PATH += glob.glob(os.path.join(BASE_PATH, "*.jpg"))
FILE_PATH += glob.glob(os.path.join(BASE_PATH, "*.jpeg"))
FILE_PATH += glob.glob(os.path.join(BASE_PATH, "*.png"))
FILE_PATH += glob.glob(os.path.join(BASE_PATH, "*.webp"))

print(FILE_PATH)

for f in FILE_PATH:
    img = Image.open(f)
    img.save(f"{f}.avif", format="avif")
