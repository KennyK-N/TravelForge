const TOKENS_PER_DAY = 550;
const MIN_COMPLETION_TOKENS = 900;
const MAX_COMPLETION_TOKENS_CAP = 16000;

export default function groqConfig(schema, prompt, numberOfDays = 1) {
  const maxCompletionTokens = Math.min(
    MAX_COMPLETION_TOKENS_CAP,
    Math.max(MIN_COMPLETION_TOKENS, numberOfDays * TOKENS_PER_DAY),
  );

  return {
    model: "openai/gpt-oss-120b",

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],

    response_format: schema,

    temperature: 0.2,

    reasoning_effort: "low",

    include_reasoning: false,

    max_completion_tokens: maxCompletionTokens,
  };
}
