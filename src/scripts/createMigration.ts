import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createMigration = async () => {
  const migrationName = process.argv[2];
  if (!migrationName) {
    console.error("Migration name is required");
    process.exit(1);
  }

  const migrationPath = path.resolve(__dirname, "../migrations");

  if (!fs.existsSync(migrationPath)) {
    fs.mkdirSync(migrationPath);
  }

  const migrationFile = `${Date.now()}_${migrationName}.ts`;

  const migrationContent = `import connection from "../settings/db";
  
  export const up = async () => {
  // Write your migration here
  };
  
  export const down = async () => {
  // Write your migration here
  };
  `;

  fs.writeFileSync(`${migrationPath}/${migrationFile}`, migrationContent);

  console.log("Migration created");
};

createMigration().then((r) => r);
