import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, {params}:{params: {courseId:string}}) {

    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
            },
        });

        if(!course){
            return new NextResponse("Course not found", {status: 404});
        }
        //.every es un método que verifica si todos los elementos en el array pasan la prueba implementada por la función dada.
        //.some es un método que verifica si al menos un elemento en el array pasa la prueba implementada por la función dada.
       
        //de la linea 34 a la 38 es solo para verficar si hay capitulos publicados,seguridad
        

        const unpublishCourse = await db.course.update({
            where: {
                id: params.courseId
            },
            data: {
                isPublished: false
            }
        });

        return NextResponse.json(unpublishCourse);


    } catch (error) {
        console.log("[COURSE_ID_UNPUBLISH_ERROR]", error);
        return new NextResponse("Internal server error", {status: 500});    
    }
}