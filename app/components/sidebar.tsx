'use client'
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function SidebarItem ({ href, title, icon }: { href: string[]; title: string; icon: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const selected = pathname.startsWith(href[1]);
    return (
        <div className={`flex flex-row gap-2 px-3 py-2 rounded-lg w-full cursor-pointer ${selected?"text-white bg-[#ac70ff]":"text-[#404040] hover:bg-gray-300"} `} 
        onClick={() => {router.push(href[0])}}>
            <div className="self-center">
                {icon}
            </div>
            <div className={` font-semibold text-xl`}>
                {title}
            </div>
        </div>
    )
}