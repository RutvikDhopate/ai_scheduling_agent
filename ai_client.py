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

    def add_message(self, role, message):
        self.messages.append({"role": role, "content": message})

    def generate(self):
        response = self.client.chat.completions.create(
            model=self.model,
            messages=self.messages,
            temperature=0.1
        )
        reply = response.choices[0].message.content
        self.add_message(role="assistant", message=reply)

    def reset(self):
        self.messages = [{"role": "system", "content": self.system_prompt}]
    
    def get_messages(self):
        return self.messages