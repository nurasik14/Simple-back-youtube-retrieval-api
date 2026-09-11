import { platform } from 'node:os';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

// Map Node.js platform names to your binary file names
const binaries = {
    win32: 'index-win-x64.exe',
    darwin: 'index-macos-arm64',
    linux: 'index-linux-x64'
};

const currentOS = platform();
const binaryName = binaries[currentOS];

if (!binaryName) {
    console.error(`Unsupported platform: ${currentOS}`);
    process.exit(1);
}

const binaryPath = path.resolve('bin', binaryName);

// Forward command-line arguments to the executable
const result = spawnSync(binaryPath, process.argv.slice(2), { stdio: 'inherit' });
process.exit(result.status ?? 0);
