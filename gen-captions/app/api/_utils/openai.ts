export const generate = async (
  prompt: string,
  base64Images: string[]
): Promise<Response> => {
  const URL = "https://api.openai.com/v1/chat/completions";
  
  const imageContent = base64Images.map(base64Image => ({
    type: "image_url" as const,
    image_url: {
      url: `data:image/jpeg;base64,${base64Image}`,
    },
  }));

  const req = {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text" as const,
            text: prompt,
          },
          ...imageContent,
        ],
      },
    ],
    stream: true,
    max_tokens: 2000,
  };

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  console.log("OpenAI Request:", JSON.stringify(req, null, 2));

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("OpenAI API Error:", response.status, response.statusText, errorData);
  }

  return response;
};
