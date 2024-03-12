"use client"

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import {  useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useSearchParams,useRouter } from "next/navigation";
import qs from "query-string";

const SearchInput = () => {

    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 500);

    const searchParams =useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: debouncedValue,
                categoryId: currentCategoryId,
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    }, [debouncedValue, currentCategoryId, pathname, router]);

    return ( 
        <div className="relative">
            <Search className="absolute top-3 left-5 text-slate-600" />
            {/* AQUI TAMBIEN PODRIAMOS HABER UTILIZADO Input de shadcn */}
            <input 
                className="w-full md:w-[300px] ml-2 h-12 pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
                placeholder="  Search for a course"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
     );
}
 
export default SearchInput;