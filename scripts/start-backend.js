const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const venvPath = path.join(__dirname, '..', 'backend', '.venv');
const isWindows = process.platform === 'win32';
const pythonBin = isWindows
  ? path.join(venvPath, 'Scripts', 'python.exe')
  : path.join(venvPath, 'bin', 'python');

if (!fs.existsSync(pythonBin)) {
  console.error('❌ Virtual environment python not found at ' + pythonBin);
  console.error('Please run setup first: npm run setup');
  process.exit(1);
}

console.log('🚀 Starting backend server on port 8000...');

const backendDir = path.join(__dirname, '..', 'backend');

// Run uvicorn inside backend directory
const child = spawn(
  pythonBin,
  ['-m', 'uvicorn', 'app.main:app', '--reload', '--port', '8000'],
  {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true
  }
);

child.on('error', (err) => {
  console.error('❌ Failed to start backend process:', err);
});
