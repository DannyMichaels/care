// Fixes ajv@8 resolution for react-scripts 5 + npm workspaces.
// ajv-keywords@5 and ajv-formats@2 need ajv@8, but npm hoists ajv@6 to root.
// This script creates symlinks from those packages to the ajv@8 nested in schema-utils.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const nm = path.join(root, 'node_modules');

// Check if the problem exists
const ajvRoot = path.join(nm, 'ajv', 'package.json');
if (!fs.existsSync(ajvRoot)) {
  console.log('fix-ajv: ajv not found, skipping');
  process.exit(0);
}

const ajvVersion = JSON.parse(fs.readFileSync(ajvRoot)).version;
if (ajvVersion.startsWith('8.')) {
  console.log('fix-ajv: ajv@8 already at root, no fix needed');
  process.exit(0);
}

// ajv@6 is at root. We need ajv@8 for ajv-keywords and ajv-formats.
// Install ajv@8 nested under each package that needs it.
const packages = ['ajv-keywords', 'ajv-formats'];

// Skip if ajv-keywords isn't installed (e.g. EAS builds where react-scripts isn't present)
if (!fs.existsSync(path.join(nm, 'ajv-keywords'))) {
  console.log('fix-ajv: ajv-keywords not found, skipping (not a web build)');
  process.exit(0);
}

for (const pkg of packages) {
  const pkgNm = path.join(nm, pkg, 'node_modules');
  const nestedAjv = path.join(pkgNm, 'ajv', 'package.json');

  if (fs.existsSync(nestedAjv)) {
    const v = JSON.parse(fs.readFileSync(nestedAjv)).version;
    if (v.startsWith('8.')) {
      console.log(`fix-ajv: ${pkg} already has ajv@${v}`);
      continue;
    }
  }

  console.log(`fix-ajv: installing ajv@8 for ${pkg}...`);
  fs.mkdirSync(pkgNm, { recursive: true });

  try {
    execSync('npm install ajv@8.17.1 --no-save --no-package-lock --ignore-scripts', {
      cwd: path.join(nm, pkg),
      stdio: 'pipe',
      env: { ...process.env, npm_config_workspaces: 'false' },
    });
    console.log(`fix-ajv: ${pkg} -> ajv@8.17.1 installed`);
  } catch (e) {
    console.warn(`fix-ajv: failed for ${pkg}: ${e.message}`);
  }
}
