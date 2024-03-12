"use client"

import { AlertTriangle, CheckCircleIcon } from "lucide-react";
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"
import { useState } from "react";

const bannerVariants = cva(
    "border text-center p-4 text-sm flex items-center w-full fixed z-50",
    {
        variants: {
            variant: {
                warning: "bg-yellow-200 border-yellow-30 text-primary",
                success: "bg-emerald-700 border-emerald-800 text-secondary",
            },
        },
        defaultVariants: {
            variant: "warning",
        },
    }
);


interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string;
};

const IconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon,
}

const Banner = ({label,variant}: BannerProps) => {
    const Icon = IconMap[variant || "warning"];
    const [showBanner, setShowBanner] = useState(true);

    const handleCloseBanner = () => {
        setShowBanner(false); // Al hacer clic en la "X", ocultamos el banner
    };

    return showBanner ? ( 
        <div className="mb-[50px] md:mb-[38px] z-50">
            <div className={cn(bannerVariants({variant}))}>
                <Icon className="h-4 w-4 mr-2"/>
                <p className="font-semibold text-[11px] lg:text-sm">{label}</p>
                <p onClick={handleCloseBanner} className="font-bold hover:text-red-600 ml-6 hover:cursor-pointer">X</p>
            </div>
           
        </div>
     ): (null)
}
 
export default Banner;