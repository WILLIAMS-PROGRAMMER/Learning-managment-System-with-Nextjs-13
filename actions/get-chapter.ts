import { db } from "@/lib/db";

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
};

export const getChapter = async({userId, courseId, chapterId}: GetChapterProps) => {

    try {
      const purchase = await db.purchase.findUnique({
            where: {
                courseId_userId: {
                    courseId,
                    userId
                }
            }
        });

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true
            },
            select: {
                price:true
            }
        });

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            },
        });

        if(!chapter || !course) {
           throw new Error("Chapter or course not found");
        }

        let muxData = null;
        let attachments:any = [];
        let nextChapter = null;

        if(purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId
                }
            });
        }

        if(chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                   chapterId: chapterId
                }
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId,
                    isPublished: true, 
                    position: {
                        gt: chapter.position //gt = greater than
                    }
                },
                orderBy: {
                    position: "asc"
                }
            });
        }

        //USER PROGRESS del capitulo , no del curso completo OJO, no confundor
        const userProgress = await db.userProgress.findUnique({
            where: {
                chapterId_userId: {
                  userId,
                  chapterId,
                }
              }
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase
        }

    } catch (error) {
        console.error("[getChapter]", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null
        }
    }
}