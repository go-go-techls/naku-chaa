export const generate = async (req: string): Promise<Response> => {
  const URL = "http://localhost:11434/api/generate";
  return await fetch(URL, {
    method: "POST",
    headers: {
      // Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: req,
  });
};
