export async function generateWithGemini(_prompt: string): Promise<string> {
  throw new Error(
    "Gemini API integration is not configured. " +
    "To enable: add a fresh GEMINI_API_KEY to your Vercel environment variables " +
    "and implement the Gemini generative model SDK call here."
  );
}
