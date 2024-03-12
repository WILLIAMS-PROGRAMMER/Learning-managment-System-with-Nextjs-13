"use client"

import { Card } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface ChartProps {
    data: {
        name:string;
        total:number;
    }[];
}

export const Chart = ({data}:ChartProps) => {
    return (
       <Card>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} tickFormatter={(value) => `$${value}`} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#8884d8" radius={[8,8,0,0]} />
                </BarChart>
            </ResponsiveContainer>
       </Card>
    )
}