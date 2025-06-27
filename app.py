import os
import pandas as pd
import streamlit as st
import json

st.set_page_config(page_title="Scheduling Agent", layout="wide")

# Session State Initialization
if 'conversation' not in st.session_state: st.session_state.conversation = []
if 'model_choice' not in st.session_state: st.session_state.model_choice = "groq-llama"

# Title and Description
st.title("Customer Support ChatBot")
st.markdown("""
            This is a scheduling agent that can understand user preferences and constraints to propose and 
            coordinate available time slots across multiple participants.
""")


# Instantiate ChatBot
# Layout - Preview + Conversation
col1, col2 = st.columns([2.5, 2.5])

with col1:
    st.subheader("Conversation")

    # Get user input first
    ui = st.chat_input("How can I assist you?")
    if ui:
        st.session_state.assistant.add_user_message(ui)
        st.session_state.conversation.append({"role": "user", "content": ui})
        # st.session_state.conversation.append({"role": "user", "content": ui})
        with st.spinner(f"Generating response via {st.session_state.model_choice}..."):
            try:
                out = st.session_state.assistant.generate()
                st.session_state.conversation.append({"role": "assistant", "content": {"prefix": out}})
            except Exception as e:
                st.error(f"Error generating output: {e}")

    # Render full conversation
    for message in reversed(st.session_state.conversation):
        with st.chat_message(message["role"]):
            st.markdown(message["content"] if message["role"] == "user" else message["content"]["prefix"])


with col2:
    st.subheader("Calendar")