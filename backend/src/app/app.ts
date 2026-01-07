import express from "express";
import cors from "cors";
import healthRoutes from "../routes/health.routes";
import familiesRoutes from "../modules/families/families.routes";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/health", healthRoutes);
  app.use("/api/families", familiesRoutes);

  // basic error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
  });
});

  return app;
};
