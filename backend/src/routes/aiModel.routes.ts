import { Router, Request, Response } from "express";
const run = require("../../aiModel");
const router = Router();

router.post("/prompt", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt format" });
    }

    const responseText: string = await run(prompt);

    // Split by newline + trim to get clean bullet points
    const formatted = responseText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    res.json({ success: true, response: formatted });
  } catch (err) {
    console.error("Error in /prompt-post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;