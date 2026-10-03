import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

import { readDB } from './db.js';

test('database starts with sample travel items', async () => {
  const items = await readDB();
  assert.ok(Array.isArray(items), 'database should return an array');
  assert.ok(items.length >= 1, 'database should include example travel entries');
});

test('server serves the main page on the root route', async () => {
  const server = spawn(process.execPath, ['server.js'], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let started = false;

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Server did not start in time')), 10000);

    server.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      if (text.includes('Server running')) {
        started = true;
        clearTimeout(timeout);
        resolve();
      }
    });

    server.stderr.on('data', (chunk) => {
      clearTimeout(timeout);
      reject(new Error(chunk.toString()));
    });
  });

  assert.equal(started, true, 'server should start successfully');

  const res = await fetch('http://localhost:3000/');
  const html = await res.text();
  assert.equal(res.status, 200, 'root route should respond with 200');
  assert.match(html, /Travel Bucket List/i, 'homepage should contain app title');

  server.kill('SIGTERM');
});
