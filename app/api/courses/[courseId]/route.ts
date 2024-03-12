import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";


const {Video} = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!);


export async function DELETE(
    req:Request,
    {params}: {params :{courseId:string}}
) {
    try {
        const {userId} = auth();
        if(!userId || !isTeacher(userId)){
            return new NextResponse("Unauthorized",{status:401})
        }
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId
            }
        });
        if(!ownCourse){
            return new NextResponse("Unauthorized",{status:401})
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });

        if(!course){
            return new NextResponse("Not found",{status:404})
        }

       for(const chapter of course.chapters){
            if(chapter.videoUrl){
            if(chapter.muxData){
                const assetId = chapter.muxData?.assetId;
                try {
                    const assetDetails = await Video.Assets.get(assetId);
                    if(assetDetails){
                        await Video.Assets.del(
                            chapter.muxData?.assetId
                        );
                    }
                } catch (error) {
                    console.log('error al obtener assetid');
                }
            }
            }
       }

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId
            }
        });


        return NextResponse.json(deletedCourse); // devuelve el curso eliminado en formato json al cliente


    } catch (error) {
        console.error("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal server error", {status:500})
    }
}





export async function PATCH(
    req: Request,
    {params}: {params: {courseId: string}}
    ) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();
    
        if (!userId || !isTeacher(userId) ) {
        return new NextResponse("UNAUTHORIZED", { status: 401 });
        }
    
        const course = await db.course.update({
            where: {
                id: courseId,
            },
            data: {
                ...values,
            },
        });

       
        
        return NextResponse.json(course); //devuelve el curso actualizado en formato json al cliente
    } catch (error) {
        console.error("[COURSE_ID]", error);
        return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
    }
}


//PARA ACTUALIZAR UN CURSO SE HACE UNA PETICION PATCH A LA RUTA /api/courses/%5BcourseId%5D