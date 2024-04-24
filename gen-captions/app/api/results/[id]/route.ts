// app/routes/api/results.tsx
import { v4 as uuidv4 } from "uuid";
import { DataItem } from "../route";
import { list } from "@/lib/testList";

const data: DataItem = list[0];

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  console.log(id);
  // TODO 検索
  if (id) {
    return Response.json(data);
  } else {
    return Response.json(new Error("Not found"), { status: 404 });
  }
}
