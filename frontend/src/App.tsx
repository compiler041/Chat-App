import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  text: string;
  self: boolean;
};

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.0.102:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: "red" },
        })
      );
    };

    ws.onmessage = (event) => {
      const text = event.data.toString();

      setMessages((prev) => {
        // Prevent duplicate echo of own message
        if (prev.length && prev[prev.length - 1].text === text) {
          return prev;
        }
        return [...prev, { text, self: false }];
      });
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (!inputRef.current || !wsRef.current) return;

    const text = inputRef.current.value.trim();
    if (!text) return;

    // Show immediately on the RIGHT
    setMessages((prev) => [...prev, { text, self: true }]);

    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: { message: text },
      })
    );

    inputRef.current.value = "";
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-black text-white text-center py-4 text-lg font-semibold">
        💬 WebSocket Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.self ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow
                ${
                  msg.self
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-white text-black rounded-bl-sm"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message…"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
