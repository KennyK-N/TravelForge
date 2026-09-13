import { useState } from "react";

import useChatHooks from "@hooks/useChatHooks.js";
import Input from "@components/form/input/Input";
import SubmitButton from "@components/chat/SubmitButton";

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    { message: "Hello! how can I help you", sender: "AI", direction: 0 },
  ]);

  const { handleSend, bottomRef, mutation } = useChatHooks(
    messages,
    setMessages,
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white pb-3 dark:bg-gray-900">
      {/* Message List */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent dark:scrollbar-thumb-white/[0.12]">
        {messages.map((m, i) => {
          const isUser = m.direction === 1;

          return (
            <div
              key={i}
              className={`flex items-end gap-2 ${
                isUser ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                  isUser
                    ? "bg-gray-100 text-gray-500 dark:bg-white/[0.08] dark:text-gray-300"
                    : "bg-indigo-100 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300"
                }`}
              >
                {isUser ? "U" : "AI"}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[72%] break-words px-4 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "rounded-[18px] rounded-br-[4px] bg-indigo-500 text-white"
                    : "rounded-[18px] rounded-bl-[4px] bg-gray-100 text-gray-700 dark:bg-white/[0.08] dark:text-gray-200"
                }`}
              >
                {m.message}
              </div>
            </div>
          );
        })}

        {mutation.isPending && (
          <div className="flex items-end gap-2">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300">
              AI
            </div>

            <div className="rounded-[18px] rounded-bl-[4px] bg-gray-100 px-4 py-2.5 text-sm text-gray-400 dark:bg-white/[0.08] dark:text-gray-400">
              typing…
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <form action={handleSend}>
        <div className="flex items-center gap-2.5 border-t border-gray-100 bg-white px-3 py-3 dark:border-white/[0.08] dark:bg-gray-900">
          <Input
            type="text"
            placeholder="Type message..."
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-indigo-400 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-indigo-400"
            name="message"
            autoComplete="off"
            relative={false}
          />

          <SubmitButton
            type="submit"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
