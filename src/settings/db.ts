import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const connection = mysql.createConnection({
  host: DB_HOST || "localhost",
  port: DB_PORT ? parseInt(DB_PORT) : 3306,
  user: DB_USER || "root",
  password: DB_PASSWORD || "",
  database: DB_NAME || "root",
});

connection.connect((error: any) => {
  if (error) {
    console.error("Database connection failed: ", error);
    return;
  }

  console.log("Database connection established");
});

export { connection as db };
