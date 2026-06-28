const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting project setup...');

// 1. Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install --prefix frontend', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed successfully.');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies:', error);
  process.exit(1);
}

// 2. Setup backend virtual environment
console.log('\n🐍 Setting up backend virtual environment...');

// Find python executable
let pythonCmd = 'python';
try {
  execSync('python --version', { stdio: 'ignore' });
} catch (e) {
  try {
    execSync('python3 --version', { stdio: 'ignore' });
    pythonCmd = 'python3';
  } catch (err) {
    console.error('❌ Python was not found in your system PATH. Please install Python and try again.');
    process.exit(1);
  }
}
console.log(`Found python: ${pythonCmd}`);

const venvPath = path.join(__dirname, '..', 'backend', '.venv');
if (!fs.existsSync(venvPath)) {
  console.log('Creating virtual environment...');
  try {
    execSync(`${pythonCmd} -m venv backend/.venv`, { stdio: 'inherit' });
    console.log('✅ Virtual environment created.');
  } catch (error) {
    console.error('❌ Failed to create virtual environment:', error);
    process.exit(1);
  }
} else {
  console.log('✅ Virtual environment already exists.');
}

// 3. Install backend dependencies
console.log('\n🐍 Installing backend dependencies...');
const isWindows = process.platform === 'win32';
const pipPath = isWindows 
  ? path.join(venvPath, 'Scripts', 'pip')
  : path.join(venvPath, 'bin', 'pip');

try {
  execSync(`"${pipPath}" install -r backend/requirements.txt`, { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed successfully.');
} catch (error) {
  console.error('❌ Failed to install backend dependencies:', error);
  process.exit(1);
}

// 4. Create environment variable templates if they don't exist
console.log('\n⚙️ Configuring environment variables...');
const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
const backendEnvExamplePath = path.join(__dirname, '..', 'backend', '.env.example');

if (!fs.existsSync(backendEnvPath)) {
  if (fs.existsSync(backendEnvExamplePath)) {
    fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
    console.log('✅ Created backend/.env from backend/.env.example');
  } else {
    fs.writeFileSync(backendEnvPath, 'DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres\nPORT=8000\n');
    console.log('✅ Created default backend/.env');
  }
} else {
  console.log('ℹ️ backend/.env already exists.');
}

const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env.local');
if (!fs.existsSync(frontendEnvPath)) {
  fs.writeFileSync(frontendEnvPath, 'NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1\n');
  console.log('✅ Created frontend/.env.local');
} else {
  console.log('ℹ️ frontend/.env.local already exists.');
}

console.log('\n🎉 Setup complete! You can now start the frontend and backend.');
console.log('To run the frontend: npm run dev:frontend');
console.log('To run the backend: npm run dev:backend');
