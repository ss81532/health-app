import { pool } from "./index";

(async () => {
  try {
    const [rows] = await pool.query("SELECT NOW() as now");
    console.log("✅ DB connected:", rows);
    process.exit(0);
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
})();
