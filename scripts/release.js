/**
 * Release Script
 * Prepares package for OutSystems Forge distribution
 */

import { promises as fs } from 'fs';
import { execSync } from 'child_process';

async function release() {
  console.log('📦 Preparing release...');
  
  try {
    // Run build
    console.log('Building...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Create release directory
    await fs.mkdir('release', { recursive: true });
    
    // Copy dist files
    await fs.copyFile('dist/prosemirror-outsystems.js', 'release/prosemirror-outsystems.js');
    await fs.copyFile('dist/prosemirror-outsystems.css', 'release/prosemirror-outsystems.css');
    
    // Copy documentation
    await fs.copyFile('README.md', 'release/README.md');
    
    // Create version file
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'));
    await fs.writeFile('release/VERSION', packageJson.version);
    
    console.log('✅ Release ready in ./release/');
    console.log(`📌 Version: ${packageJson.version}`);
    
  } catch (error) {
    console.error('❌ Release failed:', error);
    process.exit(1);
  }
}

release();