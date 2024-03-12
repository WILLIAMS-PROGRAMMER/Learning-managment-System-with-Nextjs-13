"use client"

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    isCompleted?: boolean;
    nextChapterId?: string | null;
}

export const CourseProgressButton = ({chapterId, courseId, isCompleted, nextChapterId}:CourseProgressButtonProps) => {
    const Icon = isCompleted ? XCircle : CheckCircle;

    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            const res = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isCompleted: !isCompleted
                })
            });
            const data = await res.json(); // parse the response body
            console.log(data,"data de actualizacion de progreso del capitulo");
              

            if(!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }

            if(!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast.success(`Chapter marked as ${isCompleted ? "not completed" : "completed"}`);
            router.refresh();
            
        } catch (error) {
            toast.error("An error occurred, please try again later");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button onClick={onClick} disabled={isLoading} className={cn("bg-primary text-white px-4 py-2 rounded-md flex flex-row items-center justify-center w-full md:w-auto", !isCompleted && "bg-green-500")}>
            {isCompleted ? "Mark as not complete" : "Mark as complete"}
            <Icon size={20} className="ml-2" />
        </button>
    )
}