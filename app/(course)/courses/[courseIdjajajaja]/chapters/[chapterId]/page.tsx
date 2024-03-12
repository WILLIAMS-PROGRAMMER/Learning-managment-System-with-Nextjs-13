import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { VideoPLayer } from "./_components/VidePlayer";
import { CourseEnrollButton } from "./_components/CourseEnrollButton";

import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/CourseProgressButton";

const ChapterIdPage = async({
    params}:{params:{ courseIdjajajaja:string; chapterId:string }
}) => {

    const {userId} = auth();
    if(!userId) {
        return redirect("/");
    }

    const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase} = await getChapter({
        userId,
        courseId: params.courseIdjajajaja, //jjajaja es solo para ver que funciona con cualqioer nombre
        chapterId: params.chapterId
    });

    if(!chapter || !course) {
        return redirect("/");
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeonEnd = !!purchase && !userProgress?.isCompleted; //!! es para convertir a booleano

    return ( 
        
        <div className="z-[10000]">
             {/*USER PROGRESS del capitulo , no del curso completo OJO, no confundor */}
            {userProgress?.isCompleted && (
                <Banner
                  label="You already completed this chapter"
                  variant="success"
                />
            )}
            { isLocked && (
                <Banner
                  label="You need to purchase this course to watch this chapter"
                  variant="warning"
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPLayer 
                        chapterId={params.chapterId}
                        title={chapter.title}
                        courseId={params.courseIdjajajaja}
                        nextChapterId={nextChapter?.id}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeonEnd={completeonEnd}
                        videoUrl={chapter.videoUrl!}
                    />
                </div>   
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
                        {purchase ? (
                            <div className="w-full md:w-auto">
                                <CourseProgressButton chapterId={params.chapterId} courseId={params.courseIdjajajaja} nextChapterId={nextChapter?.id} isCompleted={!!userProgress?.isCompleted} />
                            </div>
                        ): (
                            <CourseEnrollButton courseId={params.courseIdjajajaja} price={course.price!} />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={chapter.description!} />
                    </div>
                    {/* SOLO SE VERA LOS ATTACHMENTS SI SE COMPRO EL CURSO */}
                    {!!attachments.length && (
                        <>
                            <Separator />
                            <div className="p-4">
                                {attachments.map((attachment:any) => (
                                    <a className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline" href={attachment.url} target="_blank" key={attachment.id}>
                                        <File size={24} className="text-sky-700" />
                                        <p className="line-clamp-1">
                                            {attachment.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
     );
}
 
export default ChapterIdPage;



