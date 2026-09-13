import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { backEndUrl } from "@utils/constants";

export default function useChatHooks(messages, setMessages) {
  const bottomRef = useRef(null);

  const mutation = useMutation({
    mutationFn: async ({ userMessage, previousMessages }) => {
      const new_message = {
        message: userMessage,
        sender: "User",
        direction: 1,
      };

      setMessages((prev) => [...prev, new_message]);

      const res = await axios.post(
        `${backEndUrl}/ai/chat`,
        { userMessage, previousMessages },
        {
          withCredentials: true,
        },
      );

      const response = res.data;
      const text = response.data.text;

      const msg = [{ message: text, sender: "AI", direction: 0 }];

      return msg;
    },

    onSuccess: (newMessages) => {
      setMessages((prev) => [...prev, ...newMessages]);
    },

    onError: (err) => {
      const msg = [
        { message: "Failed to send message", sender: "AI", direction: 0 },
      ];

      console.error("Failed to send message:", err);

      setMessages((prev) => [...prev, ...msg]);
    },
  });

  const handleSend = async (formData) => {
    const inputMessage = formData.get("message");

    mutation.mutate({ userMessage: inputMessage, previousMessages: messages });
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, mutation.isPending]);

  return {
    bottomRef,
    handleSend,
    mutation,
  };
}
