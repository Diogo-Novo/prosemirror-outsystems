/**
 * Watch Script for Development
 * Rebuilds on file changes
 */

import { watch } from 'rollup';
import config from '../rollup.config.js';

console.log('👀 Watching for changes...');

const watcher = watch({
  ...config,
  watch: {
    include: 'src/**',
    clearScreen: false
  }
});

watcher.on('event', event => {
  if (event.code === 'START') {
    console.log('🔨 Building...');
  } else if (event.code === 'BUNDLE_END') {
    console.log('✅ Build complete!');
  } else if (event.code === 'ERROR') {
    console.error('❌ Build error:', event.error);
  }
});

// Keep process alive
process.stdin.resume();