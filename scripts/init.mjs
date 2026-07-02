import fs from "node:fs";
import path from "node:path";
import { runCommand, sleep } from "./utils.mjs";

async function init() {
	const root = process.cwd();

	const gemfileLock = path.resolve(root, "Gemfile.lock");
	const bundleDir = path.resolve(root, ".bundle");
	const vendorDir = path.resolve(root, "vendor");
	const outDir = path.resolve(root, "_site");
	const cacheDir = path.resolve(root, "docs/.jekyll-cache");
	// Safely delete files and folders (replaces 'rm -rf')
	// force: true ignores missing files, recursive: true handles folders
	console.log("Cleaning old lock files and directories...");
	await fs.promises.rm(gemfileLock, { force: true });
	await fs.promises.rm(bundleDir, { recursive: true, force: true });
	await fs.promises.rm(vendorDir, { recursive: true, force: true });
	await fs.promises.rm(outDir, { recursive: true, force: true });
	await fs.promises.rm(cacheDir, { recursive: true, force: true });

	await sleep(1000);

	// ruby setup to local
	console.log("Configuring bundler path...");
	runCommand('bundle config set --local path "vendor/bundle"');
	console.log("Configuring bundler system gems...");
	runCommand("bundle config set --local system_gems false");

	console.log("Running bundle install...");
	runCommand("bundle install");

	console.log("Init setup completed successfully!");
}

// Execute the main setup function
init().catch((err) => {
	console.error("An unexpected error occurred:", err);
	process.exit(1);
});
