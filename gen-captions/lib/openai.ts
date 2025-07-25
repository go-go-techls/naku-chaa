import { Dispatch, SetStateAction } from "react";

const ERROR_MESSAGE = "エラーです。もう一度試してみてください。";

export async function fetchData(
  base64Image: string,
  prompt: string,
  setData: Dispatch<SetStateAction<string>>
): Promise<string> {
  const request = {
    prompt,
    images: [base64Image],
  };

  console.log("Starting OpenAI generation...");

  try {
    const response = await fetch("/api/arts/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API request failed:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let accumulatedResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log("OpenAI generation completed:", { length: accumulatedResponse.length });
        return accumulatedResponse;
      }

      const text = decoder.decode(value);
      const lines = text.split(/\n+/);

      for (const line of lines) {
        const jsonText = line.replace(/^data:\s*/, "");

        if (jsonText === "[DONE]") {
          console.log("OpenAI generation completed:", { length: accumulatedResponse.length });
          return accumulatedResponse;
        }
        
        if (jsonText) {
          try {
            const data = JSON.parse(jsonText);
            const content = data.choices?.[0]?.delta?.content;
            
            if (content) {
              accumulatedResponse += content;
              setData(accumulatedResponse);
            }
          } catch (error) {
            console.error("JSON parse error:", { error, jsonText });
          }
        }
      }
    }

  } catch (error) {
    console.error("fetchData error:", error);
    setData(ERROR_MESSAGE);
    return ERROR_MESSAGE;
  }
}
