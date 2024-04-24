import React from "react";
import { Fab } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Dispatch, SetStateAction } from "react";
import { fetchData } from "@/lib/generate";
import { Data, postResult } from "@/lib/postResult";

interface ChildComponentProps {
  setImageBase64: Dispatch<SetStateAction<string>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setFeature: Dispatch<SetStateAction<string>>;
  setAdvantage: Dispatch<SetStateAction<string>>;
  setAdvice: Dispatch<SetStateAction<string>>;
}

function ImageUploadButton({
  setImageBase64,
  setTitle,
  setFeature,
  setAdvantage,
  setAdvice,
}: ChildComponentProps) {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return <div>ファイル読み取りエラー</div>;
    }

    const reader = new FileReader();
    reader.onload = async function (e) {
      e.preventDefault(); // リンクのデフォルトの遷移処理をキャンセル

      const base64ImageDisplay = e.target!.result as string;
      const base64Image = (e.target!.result as string).split(",")[1];

      setImageBase64(base64ImageDisplay);

      setTitle("");
      setFeature("");
      setAdvantage("");
      setAdvice("");

      const promptTitle = `\
あなたはアート専門のAIインストラクターです。この作品について、順守事項を踏まえた上で、回答項目を日本語の丁寧語で回答してください。回答内容は作品を展示する際に使用します。
■順守事項
・作者をリスペクトし、差別的な表現を含まない回答
・人間が思い付かないようなAIならではのユニークな視点での回答
・同じ内容を反復しない
この絵画が伝えている感情やストーリーを考え、それに合ったタイトルを20字以内で教えてください。
タイトルのみ回答してください。
タイトル：「`;
      const promptFeature = `\
あなたはアート専門のAIインストラクターです。この作品について、順守事項を踏まえた上で、回答項目を日本語の丁寧語で回答してください。回答内容は作品を展示する際に使用します。
■順守事項
・作者をリスペクトし、差別的な表現を含まない回答
・人間が思い付かないようなAIならではのユニークな視点での回答
・同じ内容を反復しない
多く人が共感する説明を、100字以内で考えてください。
`;
      const promptAdvantage = `\
あなたはアート専門のAIインストラクターです。この作品について、順守事項を踏まえた上で、回答項目を日本語の丁寧語で回答してください。回答内容は作品を展示する際に使用します。
■順守事項
・作者をリスペクトし、差別的な表現を含まない回答
・人間が思い付かないようなAIならではのユニークな視点での回答
・同じ内容を反復しない
この画像を日本語で100字程度で褒めてください。
`;
      const promptAdvice = `\
あなたはアート専門のAIインストラクターです。この作品について、順守事項を踏まえた上で、回答項目を日本語の丁寧語で回答してください。回答内容は作品を展示する際に使用します。
■順守事項
・作者をリスペクトし、差別的な表現を含まない回答
・人間が思い付かないようなAIならではのユニークな視点での回答
・同じ内容を反復しない
この作者が次の作品を制作する時の、テーマや画材のアドバイスをそれぞれ100字以内で考えてください。
`;

      const results = await Promise.all([
        fetchData(base64Image, promptTitle, setTitle),
        fetchData(base64Image, promptFeature, setFeature),
        fetchData(base64Image, promptAdvantage, setAdvantage),
        fetchData(base64Image, promptAdvice, setAdvice),
      ]);
      // const results = await Promise.all([
      //   fetchData(base64Image, promptTitle, setTitle),
      //   // fetchData(base64Image, promptFeature, setFeature),
      // ]);
      // console.log(results);
      // console.log(base64ImageDisplay);
      const req: Data = {
        title: results[0]!,
        feature: results[1]!,
        advantage: results[2]!,
        advice: results[3]!,
        image: base64ImageDisplay,
      };
      // const req: Data = {
      //   title: results[0]!,
      //   feature: "feature",
      //   advantage: "hoge",
      //   advice: "advice",
      //   image: base64ImageDisplay,
      // };
      postResult(req);
    };
    reader.readAsDataURL(file);
  };

  return (
    // <div>
    <label htmlFor="upload-button">
      <input
        style={{ display: "none" }}
        id="upload-button"
        type="file"
        onChange={handleImageChange}
      />
      <Fab
        color="primary"
        aria-label="upload picture"
        component="span"
        style={{ position: "fixed", bottom: "1.5rem", left: "1.5rem" }}
      >
        <CameraAltIcon />
      </Fab>
    </label>
  );
}

export default ImageUploadButton;
