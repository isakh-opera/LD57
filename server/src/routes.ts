import { Router, Request, Response } from "express";
import client from "./db";

const router = Router();

// Submit new high score
router.post(
  "/",
  async (
    req: Request,
    res: Response
  ) => {
    const { username, score } = req.body;

    if (!username || typeof score === 'undefined'  ) {
      res.status(400).json({ message: "Missing username or score" });
      return;
    }

    try {
      const result = await client.query(
        "INSERT INTO high_scores (username, score) VALUES ($1, $2) RETURNING *",
        [username, score]
      );
      res
        .status(201)
        .json({ message: "Score submitted", entry: result.rows[0] });
    } catch (err) {
      console.error("Error inserting score:", err);
      res.status(500).json({ message: "Error inserting score" });
    }
  }
);

// Get top 5 high scores
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await client.query(
      "SELECT username, score FROM high_scores ORDER BY score DESC LIMIT 5"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching high scores:", err);
    res.status(500).json({ message: "Error fetching high scores" });
  }
});


export default router;
