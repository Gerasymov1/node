import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connection from "../settings/db.ts";

type Migration = {
  name: string;
  id: number;
  executedAt: Date;
};

const getExistedMigrations = async () => {
  const passedMigrations: string[] = [];

  try {
    const [rows]: any = await connection.query(
      "SELECT name FROM Migrations ORDER BY name"
    );

    if (rows.length) {
      rows.forEach((row: Migration) => {
        passedMigrations.push(row.name);
      });
    }
  } catch (error) {
    console.error("Error getting migrations");
    console.error(error);
    process.exit(1);
  }

  return passedMigrations;
};

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  const existedMigrations = await getExistedMigrations();

  const migrationPath = path.resolve(__dirname, "../migrations");

  if (!fs.existsSync(migrationPath)) {
    console.error("Migrations folder does not exist");
    process.exit(1);
  }

  const migrationFiles = fs.readdirSync(migrationPath);

  const filteredMigrationFiles = migrationFiles.filter((file) =>
    file.endsWith(".ts")
  );

  const newMigrations = filteredMigrationFiles.filter(
    (file) => !existedMigrations.includes(file)
  );

  for (const file of newMigrations) {
    const migration = await import(path.resolve(migrationPath, file));

    try {
      await migration.up();
      await connection.query("INSERT INTO Migrations (name) VALUES (?)", [
        file,
      ]);
      console.log(`${file} migrated up`);
    } catch (error) {
      console.error(`Error migrating ${file} up`);
      console.error(error);
      process.exit(1);
    }
  }

  process.exit(0);
};

runMigrations().then((r) => r);
