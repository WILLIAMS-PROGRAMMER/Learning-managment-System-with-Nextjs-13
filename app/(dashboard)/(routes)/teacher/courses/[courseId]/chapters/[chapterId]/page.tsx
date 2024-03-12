import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitleForm } from "./_components/ChapterTitleForm";
import { ChapterDescriptionForm } from "./_components/ChapterDescriptionForm";
import { ChapterAccessForm } from "./_components/ChapterAccessForm";
import { ChapterVideoForm } from "./_components/ChapterVideoForm";
import Banner from "@/components/banner";
import ChapterActions from "./_components/ChapterActions";


const ChapterIdPage = async({
    params
}:{ params: {courseId:string; chapterId:string} }) => {

    const {userId} = auth();
    if(!userId){
        return redirect("/");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId
        },
        include: {
            muxData: true
        }
    });

    if(!chapter){
        return redirect('/');
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields}) fields completed`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
        {!chapter.isPublished && (
            <Banner label="This chapter is not published yet. It will not be visible to students until you publish it." variant="warning"/>
        )}
        <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link href={`/teacher/courses/${params.courseId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2"/>
                            Back to course setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                                <span className="text-sm text-slate-700">{completionText}</span>
                            </div>
                            <ChapterActions disabled={!isComplete} courseId={params.courseId} chapterId={params.chapterId} isPublished={chapter.isPublished}/>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <div className="bg-sky-200 p-2 rounded-full">
                                    <IconBadge icon={LayoutDashboard}/>
                                </div>
                                <h2 className="text-xl">Customize your chapter</h2>
                            </div>
                            <ChapterTitleForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId}/>
                            <ChapterDescriptionForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId}/>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <div className="bg-green-200 p-2 rounded-full">
                                    <IconBadge icon={Eye}/>
                                </div>
                                <h2 className="text-xl">Access Settings</h2>
                            </div> 
                            <ChapterAccessForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId}/>   
                        </div>
                    </div>
                    {/* RIGHT PART */}
                    <div>
                        <div className="flex items-center gap-x-2">
                            <div className="bg-green-200 p-2 rounded-full">
                                <IconBadge icon={Video}/>
                            </div>
                            <h2 className="text-xl">Add the video content</h2>
                        </div>
                        <ChapterVideoForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId}/>
                    </div>
                </div>
        </div>
        </>
    )
}

export default ChapterIdPage;