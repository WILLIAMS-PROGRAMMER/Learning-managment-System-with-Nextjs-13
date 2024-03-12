import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    variant?: "default" | "success";
    numerOfItems: number;
}

export const InfoCard = ({ icon: Icon, label, numerOfItems, variant }: InfoCardProps) => {
    return(
        <div className="border rounded-md flex items-center gap-x-2 p-3">
            <IconBadge icon={Icon} variant={variant} />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-lg font-medium">{numerOfItems} {numerOfItems === 1 ? "Course" : "Courses"}</p>
            </div>
        </div>
    )
}