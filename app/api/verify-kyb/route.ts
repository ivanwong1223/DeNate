// app/api/verify-kyb/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const res = await fetch("https://api.sandbox.youverify.co/v2/api/verifications/global/company-advance-check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: process.env.YOUVERIFY_API_KEY || "", // 👈 Use `token` instead of Authorization
            },
            body: JSON.stringify({
                registrationNumber: body.registrationNumber,
                countryCode: body.countryCode,
                isConsent: body.isConsent,
            }),
        });

        const text = await res.text();
        console.log("💬 KYB Raw Response:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (error) {
            return NextResponse.json({
                status: "error",
                message: "Invalid JSON response",
                raw: text,
            }, { status: 500 });
        }

        return NextResponse.json({ status: "success", data });
    } catch (err) {
        console.error("❌ Server error:", err);
        return NextResponse.json({ status: "error", message: "Something went wrong." }, { status: 500 });
    }
}
