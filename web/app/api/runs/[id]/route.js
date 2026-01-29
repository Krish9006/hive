import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), '../test_storage/runs');

export async function GET(request, { params }) {
    const { id } = params;

    try {
        const filePath = path.join(STORAGE_DIR, `${id}.json`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Run not found' }, { status: 404 });
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const run = JSON.parse(content);

        return NextResponse.json(run);
    } catch (error) {
        console.error(`Failed to fetch run ${id}:`, error);
        return NextResponse.json({ error: 'Failed to fetch run details' }, { status: 500 });
    }
}
