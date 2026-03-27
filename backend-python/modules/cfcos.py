import json
import os
from openai import AsyncOpenAI
import time
from pprint import pprint
import traceback

from config.settings import MODEL_NAME, TAG_LIST_GENERATION_PROMPT, TAGGING_PROMPT

class CFCOS:
    def __init__(self, client: AsyncOpenAI = None):
        self.semantic_summary = {}
        self.tags = []
        self.classified_files_structure = {}
        self.client = client
        self.test_case_num = 1
        
    def load_file_list(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        semantic_summary_json_path = os.path.join(base_dir, "..", "semantic_summary.json")
        
        with open(semantic_summary_json_path, "r", encoding="utf-8") as f:
            semantic_summary = json.load(f)
            self.semantic_summary = semantic_summary

        # pprint(self.semantic_summary)
        print("✅ Load complete.")

    def get_semantic_summary(self):
        if not self.semantic_summary:
            raise Exception("There's no sematic summary data.")
        return self.semantic_summary

    def select_test_case(self, test_case_num: int): # 1, 2, 3
        self.test_case_num = test_case_num
        return self.test_case_num

    async def set_tags(self, tag_list: list = []):
        if not tag_list:
            retry_delay = 3
            retry_limit = 3
            for retry_count in range(retry_limit):
                try:
                    completion = await self.client.chat.completions.create(
                        model=MODEL_NAME,
                        messages=[
                            {
                                "role": "system",
                                "content": TAG_LIST_GENERATION_PROMPT
                            },
                            {
                                "role": "user",
                                "content": json.dumps(self.semantic_summary[f"test_case_{self.test_case_num}"], ensure_ascii=False, indent=2)
                            }
                        ],
                        response_format={"type": "json_object"}
                    )
                    response = json.loads(completion.choices[0].message.content)
                    # pprint(response)
                    self.tags = response['tag_list']
                    print(f"✅ tags: {self.tags}")
                    return self.tags

                except Exception as e:
                    print(f"[⛔️ Err] Tag List Generation - count {retry_count + 1}: {e}")
                    time.sleep(retry_delay)        

            raise Exception("OpenAI API request failed after multiple retries.")

        self.tags = tag_list
        print(f"✅ tags: {self.tags}")
        return self.tags

    async def tagging(self):
        if not self.tags:
            return
        
        filenames_and_semantic_summary = {}
        idx_to_filename = {}
        for idx, filename in enumerate(self.semantic_summary[f"test_case_{self.test_case_num}"], start=1):
            idx_to_filename[str(idx)] = filename
            semantic_summary = self.semantic_summary[f"test_case_{self.test_case_num}"][filename]
            filenames_and_semantic_summary[str(idx)] = {
                "file_name": filename,
                "semantic_summary": semantic_summary
            }

        retry_delay = 3
        retry_limit = 3
        for retry_count in range(retry_limit):
            try:
                completion = await self.client.chat.completions.create(
                    model=MODEL_NAME,
                    messages=[
                        {
                            "role": "system",
                            "content": TAGGING_PROMPT
                        },
                        {
                            "role": "user",
                            "content": f"Tag List: {self.tags}"
                        },
                        {
                            "role": "user",
                            "content": json.dumps(filenames_and_semantic_summary, ensure_ascii=False, indent=2)
                        }
                    ],
                    response_format={"type": "json_object"}
                )
                response = json.loads(completion.choices[0].message.content)
                # pprint(idx_to_filename)
                # pprint(response)

                classified_files_structure = {}
                for idx in range(1, len(idx_to_filename)+1):
                    try:
                        # check missing idx
                        _tag = response[str(idx)]
                        _filename = idx_to_filename[str(idx)]
                        if _tag not in classified_files_structure:
                            classified_files_structure[_tag] = []
                        classified_files_structure[_tag].append(_filename)
                    except Exception:
                        print(f"[⛔ Err] Missing Idx - {idx}")
                self.classified_files_structure = classified_files_structure
                # pprint(self.classified_files_structure)

                print(f"✅ Tagging complete.")
                return response

            except Exception as e:
                print(f"[⛔️ Err] Tagging - count {retry_count + 1}: {e}")
                traceback.print_exc()
                time.sleep(retry_delay)

        raise Exception("OpenAI API request failed after multiple retries.")

    def get_classified_files_structure(self):
        return self.classified_files_structure
    
    def get_selected(self):
        return self.test_case_num
