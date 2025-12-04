'use client'
import { Dispatch, SetStateAction, useState } from "react"
import SidebarItem from "./sidebar";
import BarsIcon from "./icons/bar";
import LeftArrow from "./icons/leftArrow";
import HomeIcon from "./icons/home";
import BuySell from "./icons/buysell";
import HistoryIcon from "./icons/history";
import SettingsIcon from "./icons/settings";

export default function Navbar(){
    const [show,setShow] = useState(false);
    return(
        <div className="flex flex-col relative bg-white">
            {!show && <div className={`px-6 py-8 cursor-pointer `} onClick={() => {setShow(!show)}}><BarsIcon></BarsIcon></div>}
            <SideBar show = {show} setShow={setShow}></SideBar>
        </div>
    )
}




function SideBar({show,setShow} : {show : boolean,setShow : Dispatch<SetStateAction<boolean>>}){
    return(
        <div className={`w-1/6 shadow-xl bg-gray-100 h-full px-6 py-8 flex flex-col ${show?"":"-translate-x-96 "} transition-all duration-500 fixed`}>
            <div className="cursor-pointer self-end" onClick={() => {setShow(!show)}}><LeftArrow></LeftArrow></div>
            <div className="h-full flex flex-col justify-center">
                <SidebarItem href={['/dashboard?page=0','/dashboard']} title="dashboard" icon = {HomeIcon()}></SidebarItem>
                <SidebarItem href={['/sell','/sell']} title="sell" icon = {BuySell()}></SidebarItem>
                <SidebarItem href={['/buy/interested','/buy']} title="buy" icon = {BuySell()}></SidebarItem>
                <SidebarItem href={['/history','/history']} title="history" icon = {HistoryIcon()}></SidebarItem>
                <SidebarItem href={['/settings','/settings']} title="settings" icon = {SettingsIcon()}></SidebarItem>
            </div>
        </div>
    )
}





