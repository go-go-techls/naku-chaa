// import { StreamingTextResponse, Message } from "ai";
import { AIMessage, HumanMessage } from "langchain/schema";
import { ChatOllama } from "langchain/chat_models/ollama";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.
   
  Current conversation:
  {chat_history}
   
  User: {input}
  AI:`;

export default async function POST(req: Request) {
  //   const { messages } = await req.json();

  const model = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama2",
  });

  const outputParser = new BytesOutputParser();

  /*
   * Can also initialize as:
   *
   * import { RunnableSequence } from "langchain/schema/runnable";
   * const chain = RunnableSequence.from([prompt, model, outputParser]);
   */
  const body = await req.json();
  const messages = body.messages ?? [];
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const currentMessageContent = messages[messages.length - 1].content;

  const prompt = PromptTemplate.fromTemplate(TEMPLATE);

  const chain = prompt.pipe(model).pipe(outputParser);

  const stream = await chain.stream({
    chat_history: formattedPreviousMessages.join("\n"),
    input: currentMessageContent,
  });

  //   const parser = new BytesOutputParser();
  //   const parser = new StringOutputParser();

  //   const stream = await model
  //     .pipe(parser)
  //     .stream(
  //       (messages as Message[]).map((m) =>
  //         m.role == "user"
  //           ? new HumanMessage(m.content)
  //           : new AIMessage(m.content)
  //       )
  //     );

  //   const chunks = [];
  //   for await (const chunk of stream) {
  //     chunks.push(chunk);
  //   }

  //   console.log(chunks.join(""));

  return new StreamingTextResponse(stream);
}
