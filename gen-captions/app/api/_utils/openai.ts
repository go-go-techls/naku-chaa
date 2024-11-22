export const generate = async (
  prompt: string,
  base64Image: string
): Promise<Response> => {
  const URL = "https://api.openai.com/v1/chat/completions";
  base64Image;
  const req = {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    stream: true,
    max_tokens: 2000,
  };

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  return await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });
};
