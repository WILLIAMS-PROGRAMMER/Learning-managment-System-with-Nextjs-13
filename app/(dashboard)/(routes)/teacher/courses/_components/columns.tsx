"use client"

import { Button } from "@/components/ui/button"
import { Course } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => {
        const {price} = row.original;
       
        return (
           <div>
                {price? price : "0"} <span className="font-bold">USD</span>
           </div>
            
           
        )
    }
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Published
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => {
        const {isPublished} = row.original;
       
        return (
            <Badge className={cn("bg-slate-500",isPublished && "bg-sky-700")}>
                {isPublished ? "Published" : "Draft"}
            </Badge>
        )
    }
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
        const {id} = row.original; //obtenemos el id del curso
        return (
            <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" className="hover:bg-slate-100">
                    <span className="sr-only">Open Menu</span>
                    <MoreHorizontal className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-black">
                <DropdownMenuLabel className="text-white text-center">Actions</DropdownMenuLabel>
                <Link href={`/teacher/courses/${id}`}>
                    <DropdownMenuItem className="text-white text-xs hover:cursor-pointer">Edit</DropdownMenuItem>
                </Link>
                <Link href={`/teacher/analytics`}>
                        <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-white text-xs  hover:cursor-pointer">Analytics</DropdownMenuItem>
                </Link>
               
               
            </DropdownMenuContent>
            </DropdownMenu>
        )
        }
  }
  
]
