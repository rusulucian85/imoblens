/**
 * prepare-deploy.js
 *
 * Assembles the Next.js standalone build into a deploy-ready ZIP
 * for Azure App Service (Linux, Node 22).
 *
 * Usage:  node scripts/prepare-deploy.js
 * Output: imoblens-deploy.zip  (in project root)
 */

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const ROOT = path.resolve(__dirname, "..");
const STANDALONE = path.join(ROOT, ".next", "standalone");
const DEPLOY_DIR = path.join(ROOT, "deploy");
const STATIC_SRC = path.join(ROOT, ".next", "static");
const PUBLIC_SRC = path.join(ROOT, "public");

// Packages that are large and not needed at runtime in production
const PRUNE_PACKAGES = [
  "sharp",            // only needed for image optimisation server, Azure has its own
  "@img",
  "typescript",
  "@swc/core",
  "@swc/core-win32-x64-msvc",
  "@swc/core-linux-x64-gnu",
  "@swc/core-darwin-arm64",
  "@swc/core-darwin-x64",
  "caniuse-lite",
];

async function main() {
  if (!fs.existsSync(path.join(STANDALONE, "server.js"))) {
    console.error("No standalone build found — run 'npm run build' first.");
    process.exit(1);
  }

  if (fs.existsSync(DEPLOY_DIR)) fs.rmSync(DEPLOY_DIR, { recursive: true });
  fs.mkdirSync(DEPLOY_DIR, { recursive: true });

  console.log("Copying standalone build...");
  copyDirSync(STANDALONE, DEPLOY_DIR);

  if (fs.existsSync(STATIC_SRC)) {
    console.log("Copying static assets...");
    copyDirSync(STATIC_SRC, path.join(DEPLOY_DIR, ".next", "static"));
  }

  if (fs.existsSync(PUBLIC_SRC) && fs.readdirSync(PUBLIC_SRC).length > 0) {
    console.log("Copying public assets...");
    copyDirSync(PUBLIC_SRC, path.join(DEPLOY_DIR, "public"));
  }

  // Neutralise stale oryx-manifest.toml so Oryx startup doesn't try to
  // extract a node_modules tarball that no longer applies.
  fs.writeFileSync(
    path.join(DEPLOY_DIR, "oryx-manifest.toml"),
    "[BuildProperties]\nOperationId = \"standalone\"\n"
  );

  // Custom startup that cleans the stale node_modules symlink Oryx leaves
  // behind and extracts node_modules.tar.gz (which Kudu auto-creates from
  // our deployed node_modules directory during ZIP deploy).
  const startupSrc = path.join(__dirname, "startup.sh");
  if (fs.existsSync(startupSrc)) {
    fs.copyFileSync(startupSrc, path.join(DEPLOY_DIR, "startup.sh"));
    fs.chmodSync(path.join(DEPLOY_DIR, "startup.sh"), 0o755);
  }

  // Ensure @swc/helpers is present — NFT trace sometimes misses it
  const swcHelpersSrc = path.join(ROOT, "node_modules", "@swc", "helpers");
  const swcHelpersDst = path.join(DEPLOY_DIR, "node_modules", "@swc", "helpers");
  if (!fs.existsSync(swcHelpersDst) && fs.existsSync(swcHelpersSrc)) {
    fs.mkdirSync(path.join(DEPLOY_DIR, "node_modules", "@swc"), { recursive: true });
    fs.cpSync(swcHelpersSrc, swcHelpersDst, { recursive: true });
    console.log("Copied @swc/helpers into deploy/node_modules/");
  }

  // Ensure the full 'next' package is present — server.js does require('next')
  // but NFT traces only the files it statically analyzes, not the generated template.
  const nextSrc = path.join(ROOT, "node_modules", "next");
  const nextDst = path.join(DEPLOY_DIR, "node_modules", "next");
  if (fs.existsSync(nextSrc) && !fs.existsSync(nextDst)) {
    console.log("Copying next package into deploy/node_modules/...");
    fs.cpSync(nextSrc, nextDst, { recursive: true });
  }

  console.log("Pruning large unused packages...");
  const deployModules = path.join(DEPLOY_DIR, "node_modules");
  for (const pkg of PRUNE_PACKAGES) {
    const pkgPath = path.join(deployModules, pkg);
    if (fs.existsSync(pkgPath)) {
      fs.rmSync(pkgPath, { recursive: true });
      console.log(`  removed node_modules/${pkg}`);
    }
  }

  // Pre-tar node_modules so Kudu doesn't re-tar it during deploy (which can
  // hang for 15+ minutes on Linux App Service). Our startup.sh extracts it.
  console.log("Pre-tarring node_modules to avoid Kudu re-tar...");
  await new Promise((resolve, reject) => {
    const tarPath = path.join(DEPLOY_DIR, "node_modules.tar.gz");
    const out = fs.createWriteStream(tarPath);
    const tar = archiver("tar", { gzip: true, gzipOptions: { level: 6 } });
    out.on("close", resolve);
    tar.on("error", reject);
    tar.pipe(out);
    tar.directory(deployModules, "node_modules");
    tar.finalize();
  });
  fs.rmSync(deployModules, { recursive: true });

  const zipPath = path.join(ROOT, "imoblens-deploy.zip");
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  console.log("Creating ZIP archive...");
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 6 } });

    output.on("close", () => {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(1);
      console.log(`\nDeploy ZIP ready: ${zipPath} (${sizeMB} MB)`);
      console.log("\nDeploy to Azure:");
      console.log(`  az webapp deploy --resource-group imoblens --name imoblens \\`);
      console.log(`    --src-path "${zipPath}" --type zip`);
      resolve();
    });
    archive.on("error", reject);
    archive.pipe(output);
    archive.glob("**", { cwd: DEPLOY_DIR, dot: true });
    archive.finalize();
  });
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isSymbolicLink()) {
      // Resolve the symlink target and copy real content; skip if target missing
      try {
        const real = fs.realpathSync(s);
        const stat = fs.statSync(real);
        if (stat.isDirectory()) copyDirSync(real, d);
        else fs.copyFileSync(real, d);
      } catch {
        // broken symlink — skip
      }
    } else if (entry.isDirectory()) {
      copyDirSync(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
