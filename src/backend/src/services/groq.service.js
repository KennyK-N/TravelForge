import buildTripPlannerPrompt from "#backend/groq/prompt/data.prompt.js";
import buildChatPrompt from "#backend/groq/prompt/chat.prompt.js";
import inputSchema from "#backend/groq/schema/data.schema.js";
import chatSchema from "#backend/groq/schema/chat.schema.js";
import groqConfig from "#backend/groq/groq.config.js";
import groqClient from "#backend/groq/groqClient.js";

const MESSAGE_LIMIT = 10;
const DAY_LIMIT = 5;

export async function generateTripPlan({
  startDate,
  endDate,
  toCity,
  toCountry,
  interests = [],
}) {
  try {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      throw new Error("Arrival Date must be now or in the future.");
    }

    if (end < start) {
      throw new Error("Arrival Date must be on or after Arrival Date.");
    }

    const numberOfDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (numberOfDays > DAY_LIMIT) {
      throw new Error(`Trip duration cannot exceed ${DAY_LIMIT} days.`);
    }

    const prompt = buildTripPlannerPrompt({
      startDate,
      endDate,
      toCity,
      toCountry,
      interests,
    });

    const config = groqConfig(inputSchema, prompt, numberOfDays);

    const completion = await groqClient.chat.completions.create(config);

    const tripPlan = JSON.parse(
      completion.choices[0]?.message?.content ?? '{"items":[]}',
    );

    return {
      success: true,
      msg: "Task successfully generated",
      data: tripPlan,
    };
  } catch (err) {
    return {
      success: false,
      msg: err instanceof Error ? err.message : "Unknown error",
      data: null,
    };
  }
}

export async function generateAiMessage({ previousMessages, userMessage }) {
  try {
    const trimmedHistory = previousMessages.slice(-1 * MESSAGE_LIMIT);

    const prompt = buildChatPrompt({
      trimmedHistory,
      userMessage,
    });

    const config = groqConfig(chatSchema, prompt);

    const completion = await groqClient.chat.completions.create(config);

    const chatMessage = JSON.parse(
      completion.choices[0]?.message?.content ?? '{"items":[]}',
    );

    return {
      success: true,
      data: chatMessage,
      msg: "Chat message successfully generated",
    };
  } catch (err) {
    return {
      success: false,
      msg: err instanceof Error ? err.message : "Unknown error",
      data: null,
    };
  }
}
