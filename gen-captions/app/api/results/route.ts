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

type Data = DataItem[];

const data: Data = [
  {
    id: 1,
    title: "サンプルタイトル1",
    feature: "特徴1",
    advantage: "良いところ1",
    advice: "アドバイス1",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/...",
    rating: 4,
    comment: "コメント1",
  },
  {
    id: 2,
    title: "サンプルタイトル2",
    feature: "特徴2",
    advantage: "良いところ2",
    advice: "アドバイス2",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/...",
    rating: 5,
    comment: "コメント5",
  },
];

// GETリクエストを処理するAPI関数
export async function GET() {
  // TODO: データベースから全て取得
  try {
    const data = await prisma.art.findMany();
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
  // TODO: createdAtで並べ替えして返す
  const data = await req.json();
  try {
    const newArt: DataItem = await prisma.art.create({ data });
    console.log(newArt);
    return Response.json(newArt);
  } catch (error) {
    console.error("Error fetching arts:", error);
  }
}
