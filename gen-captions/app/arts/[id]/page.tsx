"use client";
import { DataItem } from "@/app/api/results/route";
import { getArt } from "@/lib/getArts";
import { Paper } from "@mui/material";
import { useEffect, useState } from "react";

export default function Arts({ params }: { params: { id: string } }) {
  const [data, setData] = useState<DataItem>({} as DataItem);

  useEffect(() => {
    getArt(params.id, setData);
  }, [params.id]); // IDが変わるたびにAPIが呼び出される

  return (
    <div>
      <h1>My Post: {params.id}</h1>
      <Paper
        elevation={3}
        sx={{
          width: "32.4vw", // ビューポートの1/3の幅
          height: "32.4vw", // ビューポートの1/3の高さ
          backgroundImage: `url(${data.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      />
    </div>
  );
}
