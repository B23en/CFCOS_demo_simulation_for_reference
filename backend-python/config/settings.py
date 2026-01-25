MODEL_NAME = "gpt-4.1-mini"
ADVANCED_MODEL_NAME = "gpt-4.1"

GENERATE_SEMANTIC_SUMMARY_PROMPT = """
- 당신은 주어진 파일 내용에 대한 자연어 형태의 요약과 키워드들을 식별하고 생성하는 AI assistant 입니다.
- 주어진 파일 내용을 잘 나타내고 설명하는 자연어 요약을 2~3줄 정도로 생성하세요.
- 추가로 해당 파일을 잘 나타내는 키워드들도 1~5개 정도 같이 생성해서 예시처럼 요약 뒤에 추가하세요.
- 반드시 요약과 키워드 리스트가 하나로 붙어있는 예시의 형태처럼 생성하세요.
- 요약과 키워드들을 통해 해당 파일을 잘 나타낼 수 있어야 합니다.
- 키워드는 간결해야하며 공백이 있을 경우 언더바를 사용하세요.
- 파일이 의미없는 내용을 포함하고 있다면 키워드는 비어있는 리스트로 생성하세요.
- 답변은 아래와 같이 "summary"라는 키에 요약을 매칭시킨 JSON 형태로 출력하세요.

예시:
{
    "summary": "해당 파일은 ~에 대한 내용이며, ~한 내용들을 포함하고 있습니다. keywords: 키워드1, 키워드2, 키워드3"
}
"""
# """
# - You are an AI assistant that identifies and generates a language summary and keywords for a given file's content.
# - Create a 2-3 sentence natural language summary that clearly describes the given file's content.
# - Additionally, generate 1-5 keywords that best represent the file, following the example format by appending them directly after the summary.
# - The summary and keywords together should accurately represent the file.
# - Keywords must be concise, and if they contain spaces, use underscores instead.
# - If the file contains meaningless content, do not generate any keywords.
# - Output your answer in JSON format, mapping the summary to the key "summary" as shown in the example.

# Example:
# {
# "summary": "This file is about ~ and contains content related to ~. keywords: keyword1, keyword2, keyword3"
# }
# """

TAG_LIST_GENERATION_PROMPT = """
- 당신은 주어진 파일 정보들을 기반으로 해당 파일들을 적절히 그룹화하기 위한 태그 리스트를 제시해주는 AI assistant 입니다.
- 주어진 "파일명 - 파일" 설명 쌍 정보들을 바탕으로 전체 파일들을 적절히 분류하기 위한 기준이 되는 태그(카테고리)와 그 이유를 아래 예시 형식에 맞춰서 작성하세요.
- 1~2개 정도의 소수로 그룹화 되는 경우, 해당 그룹에 대한 태그는 생성하지 마세요.
- 태그명을 생성할 때 [ \, /, :, *, ?, ", <, >, | ] 는 사용해서는 안됩니다.
- 태그명은 간결하게 생성하세요.
- 비슷한 성격의 태그가 여러 번 생성되지 않게 주의하세요.
- 태그 갯수는 최대 9개 까지만 허용됩니다.
- 답변은 예시와 같은 JSON 형태로 출력하세요.

예시:
{
    "tag_list": ['태그1', '태그2', '태그3'],
    "태그1_rationale": "태그1은 ~ 한 이유로 태그 리스트에 포함되기 적합합니다. 또한 ... 등 여러개의 파일에 해당 태그에 적합하기에 태그로 선정되기에 적합합니다.",
    "태그2_rationale": "태그2은 ~ 한 이유로 태그 리스트에 포함되기 적합합니다. 또한 ... 등 여러개의 파일에 해당 태그에 적합하기에 태그로 선정되기에 적합합니다.",
    "태그3_rationale": "태그3은 ~ 한 이유로 태그 리스트에 포함되기 적합합니다. 또한 ... 등 여러개의 파일에 해당 태그에 적합하기에 태그로 선정되기에 적합합니다.",
}
"""
# """
# - You are an AI assistant that suggests a tag list to appropriately group given files based on their information.
# - Using the provided "filename - file description" pairs, create tags (categories) that serve as criteria for classifying the files, and explain the rationale for each tag following the example format below.
# - If only 1–2 files fall into a particular group, do not create a tag for that group.
# - Do not use any of the following characters in tag names: [ \, /, :, *, ?, ", <, >, | ].
# - Tag names should be concise.
# - Ensure that similar tags are not generated multiple times.
# - The maximum number of tags allowed is 10.
# - Output your answer in JSON format, following the example below.

# Example:
# {
#     "tag_list": ["Tag1", "Tag2", "Tag3"],
#     "Tag1_rationale": "Tag1 is suitable for inclusion in the tag list because ~. In addition, it applies to multiple files such as ..., making it appropriate to be selected as a tag.",
#     "Tag2_rationale": "Tag2 is suitable for inclusion in the tag list because ~. In addition, it applies to multiple files such as ..., making it appropriate to be selected as a tag.",
#     "Tag3_rationale": "Tag3 is suitable for inclusion in the tag list because ~. In addition, it applies to multiple files such as ..., making it appropriate to be selected as a tag."
# }
# """

REFLECTION_PROMPT = """
생성된 태그와 rationale을 검토하세요:

1. 파일 간 rationale에 모순이 없는지 확인
2. 각 rationale이 해당 태그를 적절히 정당화하는지 확인
3. 필수 key(tag_list, tag, rationale)가 누락되지 않았는지 확인

필요하다면 태그와 rationale을 수정하세요.  
문제가 없다면 "verified": true 로 출력하세요.  
문제가 있다면 "verified": false 와 함께 구체적인 문제점을 설명하세요.  
최종 결과는 동일한 JSON 형식으로 출력하세요.

예시:
{
    "verified": "false",
    "issues": 
        [
        "File 1 rationale contradicts its assigned tag",
        "Missing rationale for File 2’s assigned tag."
        ]
}

# if there are no issues

{
    "verified": "true"
}
"""
# """
# - You have already generated a list of tags and rationales for each file.
# - Reflect on the following aspects:

# 1. Check whether each rationale contains any contradictions.
# 2. Ensure each rationale properly justifies its assigned tag.
# 3. Confirm no required keys (tag_list, tag, rationale) are missing.

# - If no issues are found, set "verified": true.
# - If any issue exists, set "verified": false and describe the problems clearly.
# - Output your answer in JSON format as shown in the example.

# Example:
# {
# "verified": "false",
# "issues": 
# [
# "File 1 rationale contradicts its assigned tag",
# "Missing rationale for File 2’s assigned tag."
# ]
# }

# # if there are no issues

# {
# "verified": "true"
# }
# """

TAGGING_PROMPT = """
- 당신은 주어진 파일 정보와 태그(카테고리) 리스트를 기반으로 각 파일에 적절한 태그를 매칭하는 AI assistant 입니다.                     
- 주어진 태그 리스트에 포함된 태그들과 "_untagged" 태그만 사용가능합니다.
- 각 파일의 정보를 참고하여 가장 적절한 태그를 할당하세요.
- 주어진 태그들 중에서 해당 파일에 적절한 태그가 존재하지 않는다면 "_untagged" 태그를 할당하세요.
- "단순히 연상이 된다"는 이유로 태그를 선택하는 것이 아닌, "해당 태그와 직접적인 연관이 있고, 해당 태그와 파일이 연관되는 근거"를 바탕으로 태그를 할당해야 합니다.
- 각 파일에 특정 태그를 부여한 이유를 rationale 항목에 간결하게 함께 작성하세요.
- 답변은 예시와 같은 JSON 형태로 출력하세요.

예시:
{
    "tag_list": ['태그1', '태그2', '태그3'],
    "1": "태그1",
    "1_rationale": "해당 파일은 ~ 한 이유로 태그1이 가장 적합합니다."
    "2": "태그1",
    "2_rationale": "해당 파일은 ~ 한 이유로 태그1이 가장 적합합니다."
    "3": "태그2",
    "3_rationale": "해당 파일은 ~ 한 이유로 특정 태그에 적합하지 않습니다."
}

- 누락된 파일이 없는지, 각 할당된 태그가 태그 리스트에 포함된 유효한 태그인지를 반드시 검증하세요.
- 어느 태그에도 적절하지 않은 파일이라면 반드시 "_untagged" 태그를 부여했는지 검증하세요.
"""
# """
# - You are an AI assistant that assigns the most appropriate tag to each file based on the given file information and tag (category) list.
# - You must only use the tags included in the given tag list, plus the "_untagged" tag.
# - Refer to each file's information to assign the most suitable tag.
# - If none of the given tags are appropriate for a file, assign the "_untagged" tag.
# - Do not select a tag merely because it is "loosely associated" with the file. Instead, select a tag only if there is a direct connection between the tag and the file, supported by evidence.
# - For each file, also include a concise rationale explaining why that tag was assigned, under the `rationale` field.
# - Output your answer in JSON format as shown in the example.

# Example:
# {
#     "tag_list": ["Tag1", "Tag2", "Tag3"],
#     "1": "Tag1",
#     "1_rationale": "This file is best suited for Tag1 because ~.",
#     "2": "Tag3",
#     "2_rationale": "This file is best suited for Tag3 because ~.",
#     "3": "_untagged",
#     "3_rationale": "This file is not suitable for the specific tag because ~."
# }

# - Verify that there are no missing files and that each assigned tag is a valid tag included in the given tag list.
# - For any file that does not match any tag, verify that the "_untagged" tag has been assigned.
# """