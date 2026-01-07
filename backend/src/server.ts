import { createApp } from "./app/app";
import dotenv from "dotenv";

dotenv.config();

const app = createApp();
const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0"; // 👈 IMPORTANT
app.listen(PORT,HOST,() => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
