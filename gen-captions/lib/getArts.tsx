import { DataItem } from "@/app/api/results/route";
import { Dispatch, SetStateAction } from "react";

export const getArt = async (
  id: number,
  setData: Dispatch<SetStateAction<DataItem>>
) => {
  try {
    const response = await fetch(`/api/results/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getArts = async (
  setData: Dispatch<SetStateAction<DataItem[]>>
) => {
  try {
    const response = await fetch(`/api/results`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
