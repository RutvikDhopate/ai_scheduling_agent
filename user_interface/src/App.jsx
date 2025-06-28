import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

function App() {
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);
    setConversation(prev => [...prev, { role: "user", content: input }]);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setConversation(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setConversation(prev => [...prev, { role: "assistant", content: "Error connecting to backend." }]);
    }
    setInput("");
    setLoading(false);
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(90deg,#f6f8fc 40%,#eef3fa 60%)"
      }}
    >
      {/* Chat Section */}
      <div
        style={{
          flex: "0 0 40%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "48px 24px 24px 24px",
          background: "#f6f8fc",
          borderRight: "1.5px solid #e0e5ec",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 8px 32px 0 rgba(60, 80, 120, 0.10)",
            padding: "32px 32px 16px 32px",
            marginBottom: 24,
          }}
        >
          <h1 style={{
            fontSize: "2.7rem",
            fontWeight: 900,
            color: "#22333b",
            marginBottom: 24
          }}>
            Scheduling Agent
          </h1>
          <div style={{ display: "flex", marginBottom: 24 }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              disabled={loading}
              style={{
                fontSize: "1.07rem",
                padding: 10,
                marginRight: 12,
                borderRadius: 10,
                border: "1.3px solid #cbd4e1",
                flex: 1,
                background: "#f8fafc"
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "8px 22px",
                fontSize: "1.1rem",
                borderRadius: 12,
                border: "none",
                background: "#e6f1ff",
                color: "#232931",
                fontWeight: 600,
                boxShadow: loading ? "none" : "0 2px 8px 0 rgba(120,160,200,0.07)"
              }}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
          <div style={{ maxHeight: 350, overflowY: "auto", paddingRight: 4 }}>
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  margin: "14px 0",
                  textAlign: msg.role === "user" ? "right" : "left"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: msg.role === "user" ? "#b3e0ff" : "#e3e4ea",
                    color: "#22223b",
                    borderRadius: 13,
                    padding: "13px 20px",
                    maxWidth: "80%",
                    fontWeight: 500,
                    boxShadow: msg.role === "user"
                      ? "0 1px 6px rgba(60,140,200,0.07)"
                      : "0 1px 6px rgba(60,60,80,0.06)"
                  }}
                >
                  {msg.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div
        style={{
          flex: "0 0 60%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          background: "#eef3fa",
          padding: "54px 0 0 0"
        }}
      >
        <div
          style={{
            width: 410,
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 8px 32px 0 rgba(60, 80, 120, 0.10)",
            padding: "32px 24px",
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: "2rem", marginBottom: 22, color: "#22333b" }}>Calendar</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="react-calendar-fancy"
            tileClassName={({ date, view }) =>
              (date.toDateString() === selectedDate.toDateString() ? 'selected-date' : '')
            }
          />
          <div style={{
            marginTop: 30,
            fontSize: "1.13rem",
            fontWeight: 500,
            color: "#333"
          }}>
            <b>Selected Date:</b> {selectedDate.toDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
