#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building ProseMirror for OutSystems...\n');

// Clean dist folder
console.log('🧹 Cleaning dist folder...');
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true });
}
fs.mkdirSync(distPath);

// Run TypeScript compiler for type declarations
console.log('📝 Generating type declarations...');
execSync('tsc --emitDeclarationOnly', { stdio: 'inherit' });

// Run Rollup
console.log('📦 Bundling with Rollup...');
execSync('rollup -c', { stdio: 'inherit' });

console.log('\n✅ Build complete!\n');
console.log('Output files:');
console.log('  - dist/prosemirror-outsystems.js');
console.log('  - dist/prosemirror-outsystems.css');

if (process.env.NODE_ENV === 'production') {
  console.log('  - dist/prosemirror-outsystems.min.js');
  console.log('  - dist/prosemirror-outsystems.min.css');
}

console.log('\n📊 Bundle size:');
const jsSize = fs.statSync(path.join(distPath, 'prosemirror-outsystems.js')).size;
console.log(`  JS: ${(jsSize / 1024).toFixed(2)} KB`);

const cssSize = fs.statSync(path.join(distPath, 'prosemirror-outsystems.css')).size;
console.log(`  CSS: ${(cssSize / 1024).toFixed(2)} KB`);