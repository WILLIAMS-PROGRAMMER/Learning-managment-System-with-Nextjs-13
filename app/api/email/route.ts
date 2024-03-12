import enviarCorreo from "@/lib/email";
import { NextResponse } from "next/server";

export async  function POST (req: Request) {

    try {
        const EmailContent = await req.json();

        enviarCorreo(EmailContent);
        return NextResponse.json(EmailContent); //devuelve el email creado en formato json al cliente
    
    } catch (error) {
        console.error( "[EMAIL]",error);
        return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
    }
}