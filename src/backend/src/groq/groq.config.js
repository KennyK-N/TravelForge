export default function groqConfig(schema, prompt, numberOfDays = 1) {
  const maxCompletionTokens = Math.min(4000, Math.max(700, numberOfDays * 350));

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
