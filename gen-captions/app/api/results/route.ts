// app/routes/api/results.tsx
import { v4 as uuidv4 } from "uuid";

export type DataItem = {
  id: string;
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
    id: "1",
    title: "サンプルタイトル1",
    feature: "特徴1",
    advantage: "良いところ1",
    advice: "アドバイス1",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/...",
    rating: 4,
    comment: "コメント1",
  },
  {
    id: "2",
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
export function GET() {
  return Response.json(data);
}

// POSTリクエストを処理するAPI関数
export async function POST(req: Request) {
  const { title, feature, advantage, advice, image, rating, comment } =
    await req.json();
  const id = uuidv4();
  const newItem: DataItem = {
    id,
    title,
    feature,
    advantage,
    advice,
    image,
    rating,
    comment,
  };
  data.push(newItem);
  console.log(newItem);
  return Response.json(newItem);
}
