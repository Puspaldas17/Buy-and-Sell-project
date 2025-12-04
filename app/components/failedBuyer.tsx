'use client'
import { useState } from "react";
import CrossIcon from "./icons/cross";
import { deleteRequestPermanetlyAction } from "../action/deleteRequest";
import Success from "./success";
import Error from "./error";
import BackgroundSupporter from "./BackgroundSupporter";
import { useRouter } from "next/navigation";
import Image from "next/image";
type ItemToBuyType = {
    buy_id : string,
    item_id : string,
    title : string,
    description : string,
    price : string,
    photo : string,
    status : string
    seller_name : string
}
type BackendResponse = {
    success : boolean | null,
    message : string
}
export default function BuyFailedCard({item} : {item : ItemToBuyType}){
    const [step,setStep] = useState<string|null>(null);
    const router = useRouter()
    const [response,setResponse] = useState<BackendResponse>({
        success : null,
        message : ""
    })
    const[loading,setLoading] = useState(false)
    function deleteRequest(){
        if(step == null){
            setStep('confirm')
        }
    }
    async function confirmDeleteRequest(){
        setLoading(true);
        const res = await deleteRequestPermanetlyAction(item.buy_id) as BackendResponse;
        setResponse(res);
        setLoading(false);
    }
    return (
        <div className="w-full min-h-48 grid grid-cols-12 gap-1 bg-white rounded-md shadow-lg">
            <div className="col-span-3 mt-2 ml-2 flex flex-col justify-between ">
                <div className="h-full  overflow-hidden flex items-center rounded-lg"><Image src={item.photo} alt="" className="hover:scale-105 transition-all duration-300" width={800} height={200}/></div>
                <div className="flex gap-2 px-2 py-1">Status : <div className="text-red-600 font-semibold">{item.status}</div></div>
            </div>
            <div className="col-span-7  my-2 flex flex-col gap-1">
                <div className="font-semibold text-lg  px-2 text-gray-400 cursor-pointer hover:text-black " onClick={(e) => {router.push(`/dashboard/${item.item_id}`) ; e.stopPropagation()}}>{item.title}</div>
                <div className="h-full  px-2 py-1 text-gray-400">{item.description}</div>
                <div className="flex flex-row justify-between px-2 text-gray-400">
                    <div className="">Seller : {item.seller_name}</div>
                    <div className="font-semibold text-lg">{item.price}</div>
                </div>
            </div>
            <div className="col-span-2 text-center w-full h-full flex justify-center  items-center hover:bg-red-200 rounded-md transition-all duration-500 active:scale-95 cursor-pointer active:bg-red-300" onClick={(e) => {deleteRequest();e.stopPropagation()}}>
                <CrossIcon/>
            </div>
            <BackgroundSupporter hide = {step == null}></BackgroundSupporter>
            {step == 'confirm' && 
                <div className="fixed z-50 w-1/5 h-fit px-2 py-2 bg-white rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 shadow-lg">
                    <div className="text-xl text-center py-6 flex justify-center items-center">Confirm Delete</div>
                    <Success success = {response.success} message={response.message}></Success>
                    <Error success = {response.success} message={response.message}></Error>
                    <div className="flex gap-2 justify-center">
                        <button className="bg-gray-500 w-full text-white px-8 py-2 rounded-lg active:scale-95 transition-all duration-150 hover:bg-gray-600" onClick={(e) => {setStep(null);e.stopPropagation()}}>Cancel</button>
                        <button className="bg-red-500 w-full text-white px-8 py-2 rounded-lg active:scale-95 transition-all duration-150 hover:bg-red-600" onClick={(e) => {confirmDeleteRequest();e.stopPropagation()}}>{loading?"Loading...":"Delete Permanently"}</button>
                    </div>
                </div>
            }
        </div>
    )
}