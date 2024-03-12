import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import {db} from "@/lib/db";

export async function DELETE(
    req: Request, //req es un objeto que contiene la informacion de la peticion http
    {params}: {params: {courseId: string, attachmentId: string}}
) {
    try {
        const { userId } = auth();
        if(!userId){
            return new NextResponse("UNAUTHORIZED", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
        });

        if(!courseOwner){
            return new NextResponse("YOU ARE NOT THE COURSE OWNER", { status: 401 });
        }

        const attachment = await db.attachment.delete({
            where: {
                //courseId: params.courseId,
                id: params.attachmentId,
            },
        });

        return NextResponse.json(attachment);
        

    } catch (error) {
        console.error("[COURSE_ID_ATTACHMENTS]", error);
        return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
    }
}
    


//params es un objeto que contiene los parametros de la ruta
//NextResponse es una clase que se utiliza para enviar una respuesta al cliente

//dame la tabla de status code de http
//https://developer.mozilla.org/es/docs/Web/HTTP/Status