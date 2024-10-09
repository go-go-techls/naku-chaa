// app/routes/api/results.tsx
import { NextResponse } from "next/server";
import { DataItem } from "../route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_: Request, { params }: { params: { id: string } }) {
  // TODO: データベースに接続して、selectぶんで取得
  const id = params.id;
  const numericId = parseInt(id); // 文字列を整数に変換

  async function findItemById(id: number) {
    try {
      const art = await prisma.art.findUnique({ where: { id: id } });
      return art;
    } catch (error) {
      console.error("Error fetching arts:", error);
    }
  }

  // 使用例: ID 'd6e730f8-7118-4d48-b500-d28be57a6451' を持つ要素を取得
  const item = await findItemById(numericId);
  console.log(item);

  if (item) {
    return NextResponse.json(item);
  } else {
    console.warn("Not found");
    return NextResponse.json(new Error("Not found"), { status: 404 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const numericId = parseInt(id); // 文字列を整数に変換

  try {
    const item = await prisma.art.delete({
      where: { id: numericId },
    });
    if (item) {
      console.log("Deleted item:", item);
      return NextResponse.json(item); // 正常に削除されたアイテムを返す
    }
  } catch (error) {
    console.warn("Item not found or error deleting:", error);
    return NextResponse.json(new Error("Item not found or error deleting"), {
      status: 404,
    });
  }
}
