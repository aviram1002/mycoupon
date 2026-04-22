import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'לא נשלח קובץ' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'סוג קובץ לא נתמך. יש להעלות JPG, PNG, WEBP, GIF או SVG' }, { status: 400 });
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'הקובץ גדול מדי. גודל מקסימלי: 2MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const ext = path.extname(file.name).toLowerCase();
    const baseName = path.basename(file.name, ext)
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .slice(0, 50);
    const fileName = `${baseName}-${Date.now()}${ext}`;

    const logosDir = path.join(process.cwd(), 'public', 'logos');
    await mkdir(logosDir, { recursive: true });

    const filePath = path.join(logosDir, fileName);
    await writeFile(filePath, buffer);

    const logoUrl = `/logos/${fileName}`;
    return NextResponse.json({ url: logoUrl }, { status: 201 });
  } catch (e: any) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
