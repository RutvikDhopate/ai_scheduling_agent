def format_prompt(prompt_file):
    prompt = ""
    with open(prompt_file) as file:
        for line in file:
            prompt += line
    return prompt