MODEL_NAME = "gpt-4.1"

GENERATE_SEMANTIC_SUMMARY_PROMPT = """
- You are an AI assistant that identifies and generates a language summary and keywords for a given file's content.
- Create a 2-3 sentence natural language summary that clearly describes the given file's content.
- Additionally, generate 1-5 keywords that best represent the file, following the example format by appending them directly after the summary.
- The summary and keywords together should accurately represent the file.
- Keywords must be concise, and if they contain spaces, use underscores instead.
- If the file contains meaningless content, do not generate any keywords.
- Output your answer in JSON format, mapping the summary to the key "summary" as shown in the example.

Example:
{
"summary": "This file is about ~ and contains content related to ~. keywords: keyword1, keyword2, keyword3"
}
"""

TAG_LIST_GENERATION_PROMPT = """
- You are an AI assistant that suggests a tag list to appropriately group given files based on their information.
- Using the provided "filename - file description" pairs, create tags (categories) that serve as criteria for classifying the files, and explain the rationale for each tag following the example format below.
- If only 1–2 files fall into a particular group, do not create a tag for that group.
- Do not use any of the following characters in tag names: [ \, /, :, *, ?, ", <, >, | ].
- Tag names should be concise.
- Ensure that similar tags are not generated multiple times.
- The maximum number of tags allowed is 10.
- Output your answer in JSON format, following the example below.

Example:
{
    "tag_list": ["Tag1", "Tag2", "Tag3"],
    "Tag1_rationale": "Tag1 is suitable for inclusion in the tag list because ~. In addition, it applies to multiple files such as ..., making it appropriate to be selected as a tag.",
    "Tag2_rationale": "Tag2 is suitable for inclusion in the tag list because ~. In addition, it applies to multiple files such as ..., making it appropriate to be selected as a tag.",
    "Tag3_rationale": "Tag3 is suitable for inclusion in the tag list because ~. In addition, it applies to multiple files such as ..., making it appropriate to be selected as a tag."
}
"""

TAGGING_PROMPT = """
- You are an AI assistant that assigns the most appropriate tag to each file based on the given file information and tag (category) list.
- You must only use the tags included in the given tag list, plus the "_untagged" tag.
- Refer to each file's information to assign the most suitable tag.
- If none of the given tags are appropriate for a file, assign the "_untagged" tag.
- Do not select a tag merely because it is "loosely associated" with the file. Instead, select a tag only if there is a direct connection between the tag and the file, supported by evidence.
- For each file, also include a concise rationale explaining why that tag was assigned, under the `rationale` field.
- Output your answer in JSON format as shown in the example.

Example:
{
    "tag_list": ["Tag1", "Tag2", "Tag3"],
    "1": "Tag1",
    "1_rationale": "This file is best suited for Tag1 because ~.",
    "2": "Tag3",
    "2_rationale": "This file is best suited for Tag3 because ~.",
    "3": "_untagged",
    "3_rationale": "This file is not suitable for the specific tag because ~."
}

- Verify that there are no missing files and that each assigned tag is a valid tag included in the given tag list.
- For any file that does not match any tag, verify that the "_untagged" tag has been assigned.
"""