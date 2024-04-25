// app/routes/api/results.tsx
import { v4 as uuidv4 } from "uuid";
import { DataItem } from "../route";
import { list } from "@/lib/testList";
import { Data } from "@/lib/postResult";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  // TODO: データベースに接続して、selectぶんで取得
  const id = params.id;
  console.log(id);

  // IDで要素を検索する関数
  function findItemById(id: string) {
    return list.find((item) => item.id === id);
  }

  // 使用例: ID 'd6e730f8-7118-4d48-b500-d28be57a6451' を持つ要素を取得
  const item = findItemById(id);
  console.log(item);

  // TODO 検索
  if (item) {
    return Response.json(item);
  } else {
    return Response.json(new Error("Not found"), { status: 404 });
  }
}
