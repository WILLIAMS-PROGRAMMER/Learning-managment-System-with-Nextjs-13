import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
    req:Request,
    {params}: {params: {courseId: string; chapterId: string}}
){
    try {
        const {userId} = auth();
        const {isCompleted} = await req.json();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        // upsert es una funcion de prisma que actualiza o crea un registro
        const userProgress = await db.userProgress.upsert({
            where: {
                chapterId_userId: {
                    userId,
                    chapterId: params.chapterId
                }
            },
            update: {
                isCompleted
            },
            create: {
                isCompleted,
                chapterId: params.chapterId,
                userId
            }
        })
        return NextResponse.json({userProgress});
    } catch (error) {
        console.error(error);
        return new NextResponse("An error occurred, please try again later", {status: 500});
    }
}