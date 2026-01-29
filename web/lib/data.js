import fs from 'fs';
import path from 'path';
import os from 'os';

// Points to the REAL framework storage: ~/.hive/storage/runs ({home_dir}/.hive/storage/runs)
const STORAGE_DIR = path.join(os.homedir(), '.hive', 'storage', 'runs');

export function getRuns() {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      console.warn(`Storage directory not found: ${STORAGE_DIR}`);
      return [];
    }

    const files = fs.readdirSync(STORAGE_DIR).filter(file => file.endsWith('.json'));

    const runs = files.map(file => {
      try {
        const content = fs.readFileSync(path.join(STORAGE_DIR, file), 'utf-8');
        const run = JSON.parse(content);
        return {
          id: run.id,
          goal_description: run.goal_description,
          status: run.status,
          created_at: run.created_at || run.started_at,
          metrics: run.metrics
        };
      } catch (e) {
        console.error(`Error reading run file ${file}:`, e);
        return null;
      }
    }).filter(Boolean);

    // Sort by created_at desc
    runs.sort((a, b) => {
      const dateA = new Date(a.created_at || a.started_at).getTime();
      const dateB = new Date(b.created_at || b.started_at).getTime();
      return dateB - dateA;
    });

    return runs;
  } catch (error) {
    console.error('Failed to fetch runs:', error);
    return [];
  }
}

export function getRun(id) {
  try {
    // 1. Try direct file match first (Fastest)
    const exactFilePath = path.join(STORAGE_DIR, `${id}.json`);
    if (fs.existsSync(exactFilePath)) {
      const content = fs.readFileSync(exactFilePath, 'utf-8');
      return JSON.parse(content);
    }

    // 2. Fallback: Scan all files to find matching ID (slower but robust)
    // This handles cases where filename != id (e.g. run_123.json vs run_123_backup.json)
    const files = fs.readdirSync(STORAGE_DIR).filter(file => file.endsWith('.json'));

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(STORAGE_DIR, file), 'utf-8');
        const run = JSON.parse(content);
        if (run.id === id) {
          return run;
        }
      } catch (e) {
        // Ignore malformed files
      }
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch run ${id}:`, error);
    return null;
  }
}
