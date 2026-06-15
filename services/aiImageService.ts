export async function generatePuzzleImage(prompt: string) {
  const enhancedPrompt = `
stylized illustrated adventure-game travel poster, square composition, vibrant colors, clean vector-like educational tourism art of ${prompt}
`;

  const res = await fetch("/api/puzzle/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: enhancedPrompt }),
  });

  const data = await res.json();
  return data.imageUrl;
}
