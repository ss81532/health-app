import express from "express";
import cors from "cors";
import apiRoutes from "../routes/index";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api", apiRoutes);
  // basic error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  });

  return app;
};
