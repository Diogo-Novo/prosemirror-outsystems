/**
 * Build Script
 * Compiles source files into dist/
 */

import { rollup } from 'rollup';
import config from '../rollup.config.js';
import { promises as fs } from 'fs';

async function build() {
  console.log('🔨 Building ProseMirror for OutSystems...');
  
  try {
    // Ensure dist directory exists
    await fs.mkdir('dist', { recursive: true });
    
    // Build with Rollup
    const bundle = await rollup(config);
    await bundle.write(config.output);
    await bundle.close();
    
    console.log('✅ Build complete!');
    console.log('📦 Output:');
    console.log('   - dist/prosemirror-outsystems.js');
    console.log('   - dist/prosemirror-outsystems.css');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();