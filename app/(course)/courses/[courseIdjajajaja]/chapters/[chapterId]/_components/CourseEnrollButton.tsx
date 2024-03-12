"use client"

import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

export const CourseEnrollButton = ({ courseId, price }:CourseEnrollButtonProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const onClick = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`/api/courses/${courseId}/checkout`);
            window.location.assign(response.data.url);
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false);
        }
    }
    return (
       
        <button onClick={onClick} disabled={isLoading} className="bg-primary text-white px-4 py-2 rounded-md w-full md:w-auto">
            Enroll for {formatPrice(price)}
        </button>
       
    )
}