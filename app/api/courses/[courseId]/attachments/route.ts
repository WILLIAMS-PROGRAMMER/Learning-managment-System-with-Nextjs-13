import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params}: {params: {courseId: string}}
    ) {
    try {
        const { userId } = auth();
        const {url} = await req.json();
    
        if (!userId) {
        return new NextResponse("UNAUTHORIZED", { status: 401 });
        }
    
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("UNAUTHORIZED", { status: 401 });
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(), //pop en este caso se utiliza para obtener la ultima parte de la url
                courseId: params.courseId,
            },
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.error("[COURSE_ID_ATTACHMENTS]", error);
        return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
    }
}


//PARA ACTUALIZAR UN CURSO SE HACE UNA PETICION PATCH A LA RUTA /api/courses/%5BcourseId%5D