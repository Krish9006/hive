import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Points to the test_storage directory in the parent folder
const STORAGE_DIR = path.join(process.cwd(), '../test_storage/runs');

export async function GET() {
    try {
        if (!fs.existsSync(STORAGE_DIR)) {
            console.warn(`Storage directory not found: ${STORAGE_DIR}`);
            return NextResponse.json([]);
        }

        const files = fs.readdirSync(STORAGE_DIR).filter(file => file.endsWith('.json'));

        const runs = files.map(file => {
            try {
                const content = fs.readFileSync(path.join(STORAGE_DIR, file), 'utf-8');
                const run = JSON.parse(content);
                // Return summary version
                return {
                    id: run.id,
                    goal_description: run.goal_description,
                    status: run.status,
                    created_at: run.created_at,
                    metrics: run.metrics
                };
            } catch (e) {
                console.error(`Error reading run file ${file}:`, e);
                return null;
            }
        }).filter(Boolean);

        // Sort by created_at desc
        runs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return NextResponse.json(runs);
    } catch (error) {
        console.error('Failed to fetch runs:', error);
        return NextResponse.json({ error: 'Failed to fetch runs' }, { status: 500 });
    }
}
