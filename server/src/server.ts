import express, { Request, Response } from "express";

import routes from "./routes";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ msg: "Server is up and running" });
});

app.use("/api/highscores", routes);

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
