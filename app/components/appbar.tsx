'use client'
import { useSession } from "next-auth/react"
import SearchIcon from "./icons/search";
import { signIn ,signOut} from "next-auth/react";
import { useState } from "react";
import LogoutIcon from "./icons/logout";
import ProfileIcon from "./icons/profile";
import NotificationIcon from "./icons/notification";
import Image from "next/image";


export default function AppBar(){
    const session = useSession();
    console.log(session);
    return(
        <div className="h-20 grid grid-cols-3 items-center shadow-sm px-12  sticky top-0 bg-white z-20">
            <Image src="/logo.png" alt="" className="h-16" height={16} width={250}/>
            {
                session.data?.user ? (<div className="h-12 flex">
                <input type="text" className="bg-gray-100 w-full  rounded-l-md rounded-y-md outline-[#c4a1f5] px-4 transition-all duration-100"/>
                <div className="self-center bg-gray-100 h-full px-2 rounded-r-md">
                    <SearchIcon></SearchIcon>
                </div>
                </div>) : (<div></div>)
            }
            {session.data?.user && <div className="flex flex-row justify-self-end gap-10 ">
                <NotificationIcon></NotificationIcon>
                <Profile name = {session.data.user.name || ""} email = {session.data.user.email || ""} image = {session.data.user.image || null} ></Profile>
            </div>}
            {!session.data?.user && 
                <button className="justify-self-end w-24 h-10 rounded-md active:bg-[#9257e6] bg-[#ac70ff] text-white font-medium"
                    onClick={() => {signIn()}}
                >Login</button>
            }
        </div>
    )
}




function Profile({name, email,image} : {name : string , email : string, image : string | null}){
    const [show,setShow] = useState(false);
    return(
        <>
        <Popup name = {name} email = {email} show = {show} ></Popup>
        {image && <div
            onClick={() => {setShow(!show)}}
            className="cursor-pointer"
            >
                <Image src={image} height={40} width={40} alt="" className = "rounded-full"/>
            </div>}
        {!image && 
            <div
            onClick={() => {setShow(!show)}}
            className="cursor-pointer"
            >
                <ProfileIcon/>
            </div>
        }
        </>
    )
}

function Popup({name, email,show} : {name : string , email : string,show : boolean}){
    return(
        <div className={`w-1/5 h-fit px-4 rounded-md fixed z-10 bg-white shadow-lg top-16 right-20 trnsition-all duration-150 ${show?"opacity-100 scale-100":"opacity-0 scale-95 pointer-events-none"}`}>
            <div className="border-b py-2">
                <div className="text-lg">{name}</div>
                <div className="text-gray-700">{email}</div>
            </div>
            <div className="py-4 flex justify-between hover:text-red-600 cursor-pointer"
                onClick={async () => {await signOut({callbackUrl : "https://buy-sell-app-tau.vercel.app/"})}}
            >
                <div>Logout</div>
                <LogoutIcon></LogoutIcon>
            </div>
        </div>
    )
}



