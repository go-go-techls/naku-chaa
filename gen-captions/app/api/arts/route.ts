// app/routes/api/results.tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type DataItem = {
  id: number;
  title: string;
  feature: string;
  advantage: string;
  advice: string;
  image: string;
  rating: number;
  comment: string;
  character: string;
  is_public_allowed: boolean;
};

// GETリクエストを処理するAPI関数
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  // const page = Number(req.query.page) || 1;
  // const pageSize = Number(req.query.pageSize) || 10;

  try {
    const arts = await prisma.art.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: "desc", // 'desc'は降順を意味し、'asc'は昇順を意味します。
      },
    });
    const total = await prisma.art.count();

    if (arts) {
      return NextResponse.json({ data: arts, total, page, pageSize });
      // return Response.json(arts);
    } else {
      return NextResponse.json(new Error("Not found"), { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching arts:", error);
  }
}

// POSTリクエストを処理するAPI関数
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Received data:", data);
    
    const newArt: DataItem = await prisma.art.create({ data });
    return NextResponse.json(newArt);
  } catch (error) {
    console.error("Error creating art:", error);
    return NextResponse.json(
      { error: "Failed to create art", details: (error as Error).message },
      { status: 500 }
    );
  }
}
