import { generate } from "@/app/_utils/ollama";
// import { generate } from "@/app/_utils/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // リクエストボディを取得
    const requestBody = await req.json(); // JSON形式のデータを取得
    console.log("hoge");
    // 環境変数から認証トークンを取得
    // const token = process.env.API_TOKEN;
    // if (!token) {
    //   return NextResponse.json(
    //     { error: "API token not found" },
    //     { status: 500 }
    //   );
    // }

    // llava
    const body = JSON.stringify(requestBody);
    const externalResponse = await generate(body);

    // // OpenAI
    // const externalResponse = await generate(
    //   requestBody.prompt,
    //   requestBody.images
    // );

    // エラーハンドリング
    if (!externalResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from external API" },
        { status: externalResponse.status }
      );
    }

    // ストリームをそのままクライアントに返す
    const readableStream = externalResponse.body; // ReadableStreamを取得
    if (!readableStream) {
      return NextResponse.json(
        { error: "No stream available from external API" },
        { status: 500 }
      );
    }

    // 必要なレスポンスヘッダーを設定してReadableStreamを返す
    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": externalResponse.headers.get("Content-Type")!,
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
