import os
import json
import openai
from utils.format_system_prompt import format_prompt

class SchedulingAgent:
    def __init__(self, model):
        self.model = model
        self.system_prompt = format_prompt("system_prompt.txt")
        self.client = openai.OpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=os.getenv("GROQ_API_KEY")
        )
        self.messages = [{"role": "system", "content": self.system_prompt}]

    def add_user_message(self, message):
        self.messages.append({"role": "user", "content": message})