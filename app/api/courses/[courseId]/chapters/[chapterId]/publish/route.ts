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

        const publishChapter = await db.chapter.update({
            where: {
                id: params.chapterId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishChapter);


    } catch (error) {
        console.log("[CHAPTER_PUBLISH_ERROR]", error);
        return new NextResponse("Internal server error", {status: 500});    
    }
}