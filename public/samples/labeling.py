import json
import os

def make_file_dict(folder_path):
    file_dict = {}

    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)

        if os.path.isfile(file_path):
            file_dict[file_name] = []

    return file_dict

folder_path = "./test_case_#"
result_dict = make_file_dict(folder_path)
sorted_dict = dict(sorted(result_dict.items()))
output_path = "file_dict.json"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(sorted_dict, f, ensure_ascii=False, indent=4)
print(f"JSON 파일이 저장되었습니다: {output_path}")
