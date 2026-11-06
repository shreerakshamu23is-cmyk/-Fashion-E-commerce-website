import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const clientDir = path.join(rootDir, 'client');
const serverDir = path.join(rootDir, 'server');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('\n======================================================');
console.log('  QUIET BATTLES™ // UNIFIED DEVELOPMENT ORCHESTRATOR');
console.log('  Starting Full-Stack Atelier:');
console.log('  - Backend API:  http://localhost:5000');
console.log('  - Client UI:    http://localhost:5173');
console.log('======================================================\n');

// 1. Spawn Server
const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true,
});

// 2. Spawn Client
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true,
});

function cleanup() {
  console.log('\nGracefully shutting down Quiet Battles™ servers...');
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

