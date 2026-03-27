from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import base64
from PIL import Image
from io import BytesIO

from config.settings import GENERATE_SEMANTIC_SUMMARY_PROMPT, MODEL_NAME

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

file_path = r"../src/samples/test_case_"
supported_exts = ['.txt', '.jpg']
file_list = []

cnt = 0
for file in os.listdir(file_path):
    _, ext = os.path.splitext(file)
    ext = ext.lower()
    if ext not in supported_exts:
        continue

    file_list.append(file)
    cnt += 1
file_list.sort()
print(f"{cnt} files appended.")

semantic_summary = {}
cnt = 0
for file in file_list:
    _, ext = os.path.splitext(file)
    ext = ext.lower()
    if ext == '.txt':
        # for text file.
        with open(os.path.join(file_path, file), "r", encoding="utf-8") as f:
            text = f.read()
        content = {
            "type": "text",
            "text": text
        }
    elif ext == '.jpg':
        # for image file.
        with Image.open(os.path.join(file_path, file)) as img:
            img = img.resize((512, 512))
            buffer = BytesIO()
            img.save(buffer, format="JPEG")
            base64_image = base64.b64encode(buffer.getvalue()).decode("utf-8")
        content = {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}"
            }
        }

    try:
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": GENERATE_SEMANTIC_SUMMARY_PROMPT
                },
                {
                    "role": "user",
                    "content": f"file name: {file}"
                },
                {
                    "role": "user",
                    "content": [content]
                }
            ],
            response_format={"type": "json_object"}
        )
        response = json.loads(completion.choices[0].message.content)
        semantic_summary[file] = response["summary"]
        cnt += 1
        print(f"[{cnt}] {file}: {response['summary']}")
    except Exception as e:
        cnt += 1
        print(f"[{cnt} err..]")

output_path = "_semantic_summary.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(semantic_summary, f, ensure_ascii=False, indent=4)

print("done.")