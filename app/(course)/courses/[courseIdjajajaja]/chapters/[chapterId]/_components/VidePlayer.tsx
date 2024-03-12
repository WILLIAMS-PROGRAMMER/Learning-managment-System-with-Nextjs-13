"use client" //sin esto no funciona

import { Loader, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
    playbackId: string;
    chapterId: string;
    courseId: string;
    nextChapterId?: string;
    title: string;
    isLocked: boolean;
    completeonEnd: boolean;
    videoUrl: string;

}

export const VideoPLayer = ({
    playbackId,
    chapterId,
    courseId,
    nextChapterId,
    title,
    isLocked,
    completeonEnd,
    videoUrl
}:VideoPlayerProps) => {

    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();
    const onEnd = async () => {
        if(completeonEnd) {
            try {
                const res = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        isCompleted: true
                    })
                });
                const data = await res.json();
                console.log(data,"data de actualizacion de progreso del capitulo");
                if(!nextChapterId) {
                    confetti.onOpen();
                }
                if(nextChapterId) {
                    router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
                }
                router.refresh();
            } catch (error) {
                console.error(error);
            }
        }
    }
    
    return (
       
        <div className="relative aspect-video">
            {/* {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 size={54} className="animate-spin text-secondary" />
                </div>       
            )} */}
            {
                isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                        <Lock size={54} className=" text-secondary" />
                        <p className="text-sm">This chapter is locked</p>
                    </div>
                )
            }

            {
                !isLocked && (
                 
                    <video  className={cn(" w-[100%] h-[100%]", !isReady && "hiddmen")} src={videoUrl}  controls autoPlay  onEnded={onEnd}></video>
                           
                    // <MuxPlayer
                    //     title={title}
                    //     className={cn(" w-[100%] h-[100%]",
                    //         !isReady && "hidden"
                    //     )}
                    //     onCanPlay={() => setIsReady(true)}
                        
                    //     autoPlay
                    //     playbackId={playbackId}
                    // />
                )
            }
        </div>
    );
}