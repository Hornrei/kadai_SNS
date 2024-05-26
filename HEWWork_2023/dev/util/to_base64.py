import base64
import os
import glob

def to_base64(image_path):
    with open(image_path, 'rb') as f:
        data = f.read()
        base64_data = base64.b64encode(data)
        s = base64_data.decode()
    return s

def file_output(data):
    with open('hew_project/sample_data/usericon_image/base64.txt', 'w') as f:
        f.write(data)
if __name__ == '__main__':
    BASE_PATH = os.path.dirname(os.path.abspath(__file__))
    FILE_PATH = glob.glob(os.path.join(BASE_PATH, "*.jpg"))
    file_output(to_base64(FILE_PATH))