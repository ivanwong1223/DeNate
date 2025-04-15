// app/api/ocr/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const image = formData.get('file') as File | null;
    const registrationNumber = formData.get('registrationNumber') as string;

    if (!image || !registrationNumber) {
        return NextResponse.json({ error: 'Missing file or registration number' }, { status: 400 });
    }

    const buffer = await image.arrayBuffer();
    const blob = new Blob([buffer], { type: image.type });

    const ocrApiKey = process.env.OCR_API_KEY || '';

    const ocrFormData = new FormData();
    ocrFormData.append('apikey', ocrApiKey);
    ocrFormData.append('language', 'eng');
    ocrFormData.append('isOverlayRequired', 'false');
    ocrFormData.append('file', blob, image.name);

    try {
        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: ocrFormData,
        });

        const result = await response.json();
        const parsedText = result?.ParsedResults?.[0]?.ParsedText || '';

        const match = parsedText.includes(registrationNumber);

        return NextResponse.json({ match, parsedText });
    } catch (error) {
        return NextResponse.json({ error: 'OCR failed', details: error }, { status: 500 });
    }
}