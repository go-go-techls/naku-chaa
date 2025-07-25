import { streamText } from "ai";
import type { Message } from "ai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { BytesOutputParser } from "@langchain/core/output_parsers";

import * as fs from "node:fs/promises";

// export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const imageData = await fs.readFile("./app/api/chat/track1.jpg");
  console.log(messages);
  const model = new ChatOllama({
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: "llava",
    temperature: 0.8,
  });

  const parser = new BytesOutputParser();

  const stream = await model.pipe(parser).stream(
    (messages as Message[]).map((m) =>
      m.role == "user"
        ? new HumanMessage(
            new HumanMessage({
              content: [
                {
                  type: "text",
                  text: m.content,
                },
                {
                  type: "image_url",
                  image_url: `data:image/jpeg;base64,${imageData.toString(
                    "base64"
                  )}`,
                },
              ],
            })
          )
        : new AIMessage(m.content)
    )
  );

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
