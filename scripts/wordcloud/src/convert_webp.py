import os
import sys

from PIL import Image


img_formats = [".bmp", ".jpg", ".jpeg", ".png"]


def conv_webp(file_path):
    file_type = os.path.splitext(file_path)[-1]
    if file_type.lower() in img_formats:
        img = Image.open(file_path)
        webp = file_path.replace(file_type, ".webp")
        img.save(webp, "WEBP", quality=50, method=6)

