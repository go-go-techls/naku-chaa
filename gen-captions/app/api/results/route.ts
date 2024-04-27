// app/routes/api/results.tsx
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

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
export async function GET() {
  try {
    const data = await prisma.art.findMany({
      orderBy: {
        id: "desc", // 'desc'は降順を意味し、'asc'は昇順を意味します。
      },
    });
    if (data) {
      return Response.json(data);
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
