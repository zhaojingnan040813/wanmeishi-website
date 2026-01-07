const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Helper to remove directory recursively
function deleteFolderRecursive(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.rmSync(directoryPath, { recursive: true, force: true });
    }
}

// Helper to copy file
function copyFile(src, dest) {
    fs.copyFileSync(src, dest);
}

// Helper to copy directory recursively
function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    }
}

// Main execution
try {
    console.log('Starting build...');

    // 1. Clean dist
    console.log('Cleaning dist folder...');
    deleteFolderRecursive(distDir);

    // 2. Create dist
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
    }

    // 3. Copy index.html
    console.log('Copying index.html...');
    const indexSrc = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexSrc)) {
        copyFile(indexSrc, path.join(distDir, 'index.html'));
    }

    // 4. Copy assets folder
    const assetsDir = path.join(__dirname, 'assets');
    if (fs.existsSync(assetsDir)) {
        console.log('Copying assets...');
        copyDir(assetsDir, path.join(distDir, 'assets'));
    }

    // 5. Copy png folder
    const pngDir = path.join(__dirname, 'png');
    if (fs.existsSync(pngDir)) {
        console.log('Copying png...');
        copyDir(pngDir, path.join(distDir, 'png'));
    }

    console.log('Build complete! Output directory: ' + distDir);

} catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
}
