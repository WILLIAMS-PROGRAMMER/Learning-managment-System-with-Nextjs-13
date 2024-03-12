import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//request es el objeto que se recibe del cliente
export async function POST(
    req: Request
) {
    try {
        const {userId} = auth();
        const {title} = await req.json();

        if(!userId || !isTeacher(userId)){
            return new NextResponse("UNAUTHORIZED", { status: 401 });
        }

        const course = await db.course.create({
            data: {
                userId,
                title:title,
                // title:title,  === title, ya que el nombre de la propiedad y el nombre de la variable son iguales
            }
        });
        return NextResponse.json(course); //devuelve el curso creado en formato json al cliente
    } catch (error) {
        console.error( "[COURSES]",error);
        return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
    }
}


//PARA CREAR UN CURSO NUEVO SE HACE UNA PETICION POST A LA RUTA /api/courses