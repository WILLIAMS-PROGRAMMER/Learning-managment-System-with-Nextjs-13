import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//Aqui solo se esta actualizando la posicion de los chapters, nada mas
export async function PUT(
  req:Request,
  {params}: {params: {courseId: string}}
) {
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        const updateData = await req.json();
        //console.log(updateData,);
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if(!ownCourse){
            return new NextResponse("Not Found", {status: 404});
        }

        //Se actualiza la posicion de los chapters en la base de datos
        for (let item of updateData) {
            await db.chapter.update({
                where: {
                    id: item.id
                },
                data: {
                    position: item.position
                }
            });
        }

        return new NextResponse("Success",{status: 200});

    } catch (error) {
        console.log("[REORDER]", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}