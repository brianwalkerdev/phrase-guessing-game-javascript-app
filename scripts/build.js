#!/usr/bin/env node

/**
 * Build script for Wheel of Success
 * Copies all necessary files to dist folder for static hosting
 */

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..');
const distDir = path.join(sourceDir, 'dist');

// Files and directories to copy
const itemsToCopy = [
  'index.html',
  'css',
  'js',
  'images'
];

// Create dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

console.log('🚀 Building Wheel of Success for static hosting...\n');

// Copy function
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      copyRecursive(srcPath, destPath);
    }
  } else {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied: ${path.relative(sourceDir, src)}`);
  }
}

// Copy all items
itemsToCopy.forEach(item => {
  const srcPath = path.join(sourceDir, item);
  const destPath = path.join(distDir, item);
  
  if (fs.existsSync(srcPath)) {
    copyRecursive(srcPath, destPath);
  } else {
    console.warn(`⚠ Warning: ${item} not found`);
  }
});

console.log('\n✅ Build complete! Files are ready in the dist/ folder');
console.log('📦 You can deploy the dist/ folder to any static hosting service');
console.log('   - GitHub Pages');
console.log('   - Netlify');
console.log('   - Vercel');
console.log('   - Any web server\n');
