import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token } = body;
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        // Send token to Google's verification API
        const verificationResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
            method: 'POST',
        });

        const verification = await verificationResponse.json();

        // If reCAPTCHA verification is successful
        if (verification.success) {
            return NextResponse.json({
                success: true,
                score: verification.score,
                errorCodes: verification['error-codes'] || null
            });
        } else {
            // If verification fails
            return NextResponse.json({
                success: false,
                errorCodes: verification['error-codes']
            }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Server error',
            error: error
        }, { status: 500 });
    }
}
