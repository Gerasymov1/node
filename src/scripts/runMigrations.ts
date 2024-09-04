import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  const migrationPath = path.resolve(__dirname, "../migrations");

  if (!fs.existsSync(migrationPath)) {
    console.error("Migrations folder does not exist");
    process.exit(1);
  }

  const migrationFiles = fs.readdirSync(migrationPath);

  const filteredMigrationFiles = migrationFiles.filter((file) =>
    file.endsWith(".ts")
  );

  const sortedByTimestampMigrationFiles = filteredMigrationFiles.sort(
    (a, b) => {
      const aTimestamp = parseInt(a.split("_")[0]);
      const bTimestamp = parseInt(b.split("_")[0]);

      return aTimestamp - bTimestamp;
    }
  );

  for (const file of sortedByTimestampMigrationFiles) {
    const migration = await import(path.resolve(migrationPath, file));

    try {
      await migration.up();
      console.log(`${file} migrated up`);
    } catch (error) {
      console.error(`Error migrating ${file} up`);
      console.error(error);
    }
  }
};

runMigrations().then((r) => r);
