'use client'
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Tabs({title , href} : {title : string,href : string}){
    const router = useRouter();
    const pathname = usePathname()
    const selected = (pathname === href)
    console.log(pathname + href)
    return(
        <div className={`${selected?"text-[#ac70ff] border-b-4 border-[#ac70ff] font-medium":""} px-4 py-1 rounded-t-md cursor-pointer hover:text-[#ac70ff]`} onClick={() => {router.push(href)}}>{title}</div>
    )
}