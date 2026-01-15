#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function release() {
  console.log('🚀 Release Script for ProseMirror OutSystems\n');

  // Read current version
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
  );
  const currentVersion = packageJson.version;

  console.log(`Current version: ${currentVersion}\n`);

  const newVersion = await question('Enter new version (e.g., 0.2.0): ');

  if (!newVersion.match(/^\d+\.\d+\.\d+$/)) {
    console.error('❌ Invalid version format. Use x.y.z');
    process.exit(1);
  }

  const confirm = await question(`\nRelease version ${newVersion}? (y/n): `);
  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Release cancelled');
    process.exit(0);
  }

  try {
    // Update version in package.json
    console.log('\n📝 Updating version...');
    packageJson.version = newVersion;
    fs.writeFileSync(
      path.join(__dirname, '..', 'package.json'),
      JSON.stringify(packageJson, null, 2) + '\n'
    );

    // Run tests
    console.log('\n🧪 Running tests...');
    execSync('npm test', { stdio: 'inherit' });

    // Build production bundle
    console.log('\n📦 Building production bundle...');
    execSync('npm run build:prod', { stdio: 'inherit' });

    // Git operations
    console.log('\n📌 Creating git tag...');
    execSync(`git add .`, { stdio: 'inherit' });
    execSync(`git commit -m "Release v${newVersion}"`, { stdio: 'inherit' });
    execSync(`git tag v${newVersion}`, { stdio: 'inherit' });

    console.log('\n✅ Release prepared!');
    console.log('\nNext steps:');
    console.log('  1. git push origin main');
    console.log(`  2. git push origin v${newVersion}`);
    console.log('  3. npm publish (if publishing to npm)');
    console.log('  4. Create GitHub release with dist files');

  } catch (error) {
    console.error('\n❌ Release failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

release();