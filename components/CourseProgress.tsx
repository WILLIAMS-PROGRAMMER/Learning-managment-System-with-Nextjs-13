import { cn } from "@/lib/utils";

interface CourseProgressProps {
    value: number;
    variant?: "default" | "warning" | "success",
    size?: "sm" | "md" | "lg" | "default";
}

const colorByVariant = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    default: "bg-green-500",
}

const sizeByVariant = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
    default: "h-4",
}

//Promise se pone mas que todo para el codigo sea mas legible y para que se entienda que es una promesa
export const CourseProgress = ({value, variant, size}:CourseProgressProps) => {
    return (
        <div>
            <div className="w-full bg-gray-200 rounded-full">
                <div id="progressBar" className={cn(`text-xs leading-none py-1 text-center text-white rounded-full`, colorByVariant[variant || "default"], sizeByVariant[size || "default"] )} style={{ width: `${value}%` }}>
                    <p className={cn("font-medium mt-6 text-sky-700 ml-4 whitespace-nowrap")}>{Math.round(value)}% complete</p>
                </div>
            </div>
        </div>
    );
}