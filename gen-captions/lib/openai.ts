import { Dispatch, SetStateAction } from "react";

// Type definitions
interface OpenAIRequest {
  prompt: string;
  images: string[];
}

interface OpenAIStreamResponse {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
}

interface StreamProcessorOptions {
  onChunk: (content: string) => void;
  onComplete: (fullContent: string) => void;
  onError: (error: Error) => void;
}

// Constants
const API_ENDPOINT = "/api/arts/generate";
const STREAM_DONE_MARKER = "[DONE]";
const ERROR_MESSAGE = "エラーです。もう一度試してみてください。";

// Utility functions
const createTextDecoder = () => new TextDecoder("utf-8");

const parseStreamLine = (line: string): string => {
  return line.replace(/^data:\s*/, "");
};

const isValidOpenAIResponse = (data: any): data is OpenAIStreamResponse => {
  return data && typeof data === "object";
};

const extractContentFromResponse = (data: OpenAIStreamResponse): string | null => {
  return data.choices?.[0]?.delta?.content || null;
};

// Main streaming processor
async function processOpenAIStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  options: StreamProcessorOptions
): Promise<string> {
  const decoder = createTextDecoder();
  let accumulatedResponse = "";

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      options.onComplete(accumulatedResponse);
      return accumulatedResponse;
    }

    const text = decoder.decode(value);
    const lines = text.split(/\n+/);

    for (const line of lines) {
      const jsonText = parseStreamLine(line);

      if (jsonText === STREAM_DONE_MARKER) {
        options.onComplete(accumulatedResponse);
        return accumulatedResponse;
      }
      
      if (jsonText) {
        try {
          const data = JSON.parse(jsonText);
          
          if (isValidOpenAIResponse(data)) {
            const content = extractContentFromResponse(data);
            if (content) {
              accumulatedResponse += content;
              options.onChunk(accumulatedResponse);
            }
          }
        } catch (error) {
          console.error("JSON parse error:", { error, jsonText });
          // Continue processing other lines instead of failing completely
        }
      }
    }
  }
}

// Main export function
export async function fetchData(
  base64Image: string,
  prompt: string,
  setData: Dispatch<SetStateAction<string>>
): Promise<string> {
  const request: OpenAIRequest = {
    prompt,
    images: [base64Image],
  };

  console.log("Starting OpenAI generation...");

  try {
    const response = await fetch(API_ENDPOINT, {
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

    return await processOpenAIStream(reader, {
      onChunk: (content) => setData(content),
      onComplete: (fullContent) => {
        console.log("OpenAI generation completed:", { length: fullContent.length });
      },
      onError: (error) => {
        console.error("Stream processing error:", error);
        setData(ERROR_MESSAGE);
      },
    });

  } catch (error) {
    console.error("fetchData error:", error);
    setData(ERROR_MESSAGE);
    return ERROR_MESSAGE;
  }
}
