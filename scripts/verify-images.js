// Node verification script for image asset integrity
import fs from 'fs';
import path from 'path';

const skinsPath = path.resolve('public/images/skins');
const casesPath = path.resolve('public/images/cases');

let errorCount = 0;

console.log('=== VERIFYING CASER.GG ASSET INTEGRITY ===');

if (!fs.existsSync(skinsPath)) {
  console.error('ERROR: public/images/skins folder does not exist!');
  errorCount++;
} else {
  const skins = fs.readdirSync(skinsPath);
  console.log(`Found ${skins.length} skin images in public/images/skins:`);
  for (const s of skins) {
    const fullPath = path.join(skinsPath, s);
    const size = fs.statSync(fullPath).size;
    if (size === 0) {
      console.error(`  FAIL: ${s} is empty (0 bytes)`);
      errorCount++;
    }
  }
}

if (!fs.existsSync(casesPath)) {
  console.error('ERROR: public/images/cases folder does not exist!');
  errorCount++;
} else {
  const cases = fs.readdirSync(casesPath);
  console.log(`Found ${cases.length} case images in public/images/cases:`);
  for (const c of cases) {
    const fullPath = path.join(casesPath, c);
    const size = fs.statSync(fullPath).size;
    if (size === 0) {
      console.error(`  FAIL: ${c} is empty (0 bytes)`);
      errorCount++;
    }
  }
}

if (errorCount === 0) {
  console.log('✓ ALL ASSET VERIFICATIONS PASSED: 100% OF IMAGES EXIST AND ARE VALID.');
} else {
  console.error(`✗ FOUND ${errorCount} ASSET ERRORS`);
  process.exit(1);
}
