#!/usr/bin/env node

/**
 * Database Setup Script
 * Runs migrations and seeds for all backend services
 * Uses Node.js instead of shell commands for better cross-platform compatibility
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const PROJECTS = ["top-users", "top-finance"];
const PROJECT_ROOT = __dirname;

// Colors for output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

async function setupDatabase() {
  try {
    log(
      "\n╔════════════════════════════════════════════════════════════════╗",
      "blue"
    );
    log(
      "║  DATABASE SETUP - MIGRATIONS AND SEEDS                         ║",
      "blue"
    );
    log(
      "╚════════════════════════════════════════════════════════════════╝\n",
      "blue"
    );

    // Wait a bit more for database to be fully ready
    log("Waiting for database to be fully ready...", "yellow");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    for (const project of PROJECTS) {
      const projectPath = path.join(PROJECT_ROOT, project);

      if (!fs.existsSync(projectPath)) {
        log(`⚠️  Project ${project} not found, skipping...`, "yellow");
        continue;
      }

      log(`\n📍 Setting up ${project}...`, "blue");

      // Run migrations with retry
      let migrationSuccess = false;
      let migrationAttempts = 0;
      const maxMigrationAttempts = 3;

      while (!migrationSuccess && migrationAttempts < maxMigrationAttempts) {
        try {
          log(
            `  Running migrations for ${project}... (attempt ${
              migrationAttempts + 1
            }/${maxMigrationAttempts})`,
            "yellow"
          );
          await runCommand("npm", ["run", "migrate:latest"], projectPath);
          log(`  ✅ Migrations completed for ${project}`, "green");
          migrationSuccess = true;
        } catch (error) {
          migrationAttempts++;
          if (migrationAttempts < maxMigrationAttempts) {
            log(
              `  ⚠️  Migration attempt ${migrationAttempts} failed, retrying in 5 seconds...`,
              "yellow"
            );
            await new Promise((resolve) => setTimeout(resolve, 5000));
          } else {
            log(
              `  ❌ Migration failed for ${project} after ${maxMigrationAttempts} attempts`,
              "red"
            );
            log(`  Error: ${error.message}`, "red");
            throw error;
          }
        }
      }

      // Run seeds
      try {
        log(`  Running seeds for ${project}...`, "yellow");
        await runCommand("npm", ["run", "seed:run"], projectPath);
        log(`  ✅ Seeds completed for ${project}`, "green");
      } catch (error) {
        log(`  ❌ Seed failed for ${project}`, "red");
        log(`  Error: ${error.message}`, "red");
        throw error;
      }
    }

    log(
      "\n╔════════════════════════════════════════════════════════════════╗",
      "green"
    );
    log(
      "║  ✅ DATABASE SETUP COMPLETED SUCCESSFULLY                      ║",
      "green"
    );
    log(
      "╚════════════════════════════════════════════════════════════════╝\n",
      "green"
    );

    process.exit(0);
  } catch (error) {
    log(
      "\n╔════════════════════════════════════════════════════════════════╗",
      "red"
    );
    log(
      "║  ❌ DATABASE SETUP FAILED                                      ║",
      "red"
    );
    log(
      "╚════════════════════════════════════════════════════════════════╝\n",
      "red"
    );
    log(`Error: ${error.message}`, "red");
    process.exit(1);
  }
}

setupDatabase();
