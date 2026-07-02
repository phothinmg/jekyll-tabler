import fs from "node:fs";
import path from "node:path";
import { execSync } from "child_process";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function runCommand(command) {
	try {
		execSync(command, { stdio: "inherit" });
	} catch (error) {
		console.error(`\nError: Command failed -> "${command}"`);
		process.exit(error.status || 1);
	}
}

export function deleteFolder(folderPath) {
	try {
		fs.rmSync(folderPath, { recursive: true, force: true });
		console.log(`${folderPath} and contents deleted successfully.`);
	} catch (err) {
		console.error(`Error deleting folder: ${err.message}`);
	}
}

export async function clearFolder(dirPath) {
	try {
		const files = await fs.readdir(dirPath);

		for (const file of files) {
			const currentPath = path.join(dirPath, file);
			// Deletes files or folders recursively
			await fs.promises.rm(currentPath, { recursive: true, force: true });
		}
		console.log("Folder cleared successfully.");
	} catch (err) {
		console.error(`Error clearing folder: ${err.message}`);
	}
}
