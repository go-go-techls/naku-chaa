// app/routes/api/results.tsx
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export type DataItem = {
  id: number;
  title: string;
  feature: string;
  advantage: string;
  advice: string;
  image: string;
  rating: number;
  comment: string;
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
      return Response.json({ data: arts, total, page, pageSize });
      // return Response.json(arts);
    } else {
      return Response.json(new Error("Not found"), { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching arts:", error);
  }
}

// POSTリクエストを処理するAPI関数
export async function POST(req: Request) {
  const data = await req.json();
  try {
    const newArt: DataItem = await prisma.art.create({ data });
    console.log(newArt);
    return Response.json(newArt);
  } catch (error) {
    console.error("Error fetching arts:", error);
  }
}
