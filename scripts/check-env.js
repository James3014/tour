#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REQUIRED_KEYS = ['RESORT_API_BASE_URL', 'USER_CORE_API_URL'];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').reduce((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return acc;
    }
    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=').trim().replace(/^["']|["']$/g, '');
    acc[key] = value;
    return acc;
  }, {});
}

function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const fileEnv = {
    ...parseEnvFile(path.join(projectRoot, '.env')),
    ...parseEnvFile(path.join(projectRoot, '.env.local')),
  };

  const missing = [];
  for (const key of REQUIRED_KEYS) {
    const value = process.env[key] || fileEnv[key];
    if (!value || value === '""' || value === "''") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error(
      `[check-env] 缺少必要環境變數：${missing.join(', ')}。` +
        '請在環境變數或 .env(.local) 中設定。'
    );
    process.exit(1);
  }

  console.log('[check-env] 所有必要變數已設定。');
}

main();
