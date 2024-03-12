import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, {params}:{params: {courseId:string; chapterId:string}}) {

    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        const ownCourse = await db.course.findFirst({
            where: {
                id: params.courseId,
            }
        });

        if(!ownCourse){
            return new NextResponse("Course not found", {status: 404});
        }

        const unpublishChapter = await db.chapter.update({
            where: {
                id: params.chapterId
            },
            data: {
                isPublished: false
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });

        //si no hay capitulos publicados en el curso despues de eliminar ese chapter, entonces el curso no esta publicado
        if(!publishedChaptersInCourse.length){
            await db.course.update({
                where: {
                    id: params.courseId
                },
                // data es para actualizar los datos
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json(unpublishChapter);


    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH_ERROR]", error);
        return new NextResponse("Internal server error", {status: 500});    
    }
}