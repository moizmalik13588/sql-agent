"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

type AIInput = {
  query: string;
};

type AIOutput = {
  rows: string[];
};

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl flex flex-col h-[85vh] bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h12M2 8h8M2 12h10"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">SQL Agent</p>
            <p className="text-xs text-zinc-500">
              Ask anything about your database
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            <span className="text-xs text-zinc-500">Connected</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 4h12M2 8h8M2 12h10"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-zinc-400 text-sm">
                Ask a question about your database
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium mt-0.5 ${
                  message.role === "user"
                    ? "bg-zinc-700 text-zinc-300"
                    : "bg-blue-500/10 text-blue-400"
                }`}
              >
                {message.role === "user" ? "U" : "AI"}
              </div>

              <div
                className={`max-w-[80%] flex flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}
              >
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            message.role === "user"
                              ? "bg-blue-600 text-white rounded-tr-sm"
                              : "bg-zinc-800 text-zinc-100 rounded-tl-sm"
                          }`}
                        >
                          {part.text}
                        </div>
                      );

                    case "tool-db":
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="w-full p-3 bg-blue-500/10 rounded-xl border border-blue-500/20"
                        >
                          <div className="font-medium text-blue-400 text-xs mb-2">
                            🔍 Database Query
                          </div>
                          {(part.input as unknown as AIInput)?.query && (
                            <pre className="font-mono text-xs bg-zinc-900 rounded-lg p-3 overflow-x-auto border-l-2 border-blue-500 whitespace-pre-wrap text-zinc-300">
                              {(part.input as unknown as AIInput).query}
                            </pre>
                          )}
                          {part.state === "output-available" &&
                            (part.output as unknown as AIOutput) && (
                              <div className="text-xs text-emerald-400 mt-2">
                                ✅ Returned{" "}
                                {(part.output as unknown as AIOutput).rows
                                  ?.length || 0}{" "}
                                rows
                              </div>
                            )}
                        </div>
                      );

                    case "tool-schema":
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="w-full p-3 bg-purple-500/10 rounded-xl border border-purple-500/20"
                        >
                          <div className="font-medium text-purple-400 text-xs">
                            📋 Schema Tool
                          </div>
                          {part.state === "output-available" && (
                            <div className="text-xs text-emerald-400 mt-1">
                              ✅ Schema loaded
                            </div>
                          )}
                        </div>
                      );

                    case "step-start":
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="text-xs text-zinc-500"
                        >
                          🔄 Processing...
                        </div>
                      );

                    case "reasoning":
                      return null;

                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-800">
          <form
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return;
              sendMessage({ text: input });
              setInput("");
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="Ask about your database..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 8h10M8 3l5 5-5 5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
