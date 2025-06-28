from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_client import SchedulingAgent

app = Flask(__name__)
CORS(app)

# Instantiate your agent once at startup
agent = SchedulingAgent(model="llama-3.3-70b-versatile")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    agent.add_message("user", user_message)
    agent.generate()  # This should add the assistant message internally
    # Get the latest assistant reply
    assistant_messages = [m for m in agent.get_messages() if m["role"] == "assistant"]
    reply = assistant_messages[-1]["content"] if assistant_messages else "No reply"
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
