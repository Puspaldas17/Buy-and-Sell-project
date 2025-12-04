'use client'
import { useState } from "react";
import DeleteIcon from "./icons/delete";
import DownChevelron from "./icons/downChevelron";
import UpChevron from "./icons/upChevron";
import EditIcon from "./icons/edit";
import Image from "next/image";
import BackgroundSupporter from "./BackgroundSupporter";
import rejectBuyerFromBuying from "../action/rejectBuyer";
import Success from "./success";
import Error from "./error";
import { deleteItemPermanentlyAction } from "../action/deleteItem";
import { confirmSellAction } from "../action/sellItem";

type ItemToSell = {
    id : string,
    title : string,
    description : string,
    price : string,
    time : string,
    photo : string,
    Buyer : {
        buy_id : string,
        buyer_id : string,
        message : string,
        buyer_contact : string,
        buyer_name : string,
    }[],
    requestCount : number
}

export default function SellingItemComponent({item} : {item : ItemToSell}){
    const[show,setShow] = useState(false);
    const [step,setStep] = useState<string|null>(null)
    const [response,setResponse] = useState<BackendResponse>({
        success : null,
        message : ""
    })
    const[loading,setLoading] = useState(false)
    function deleteItem(){
        if(step == null){
            setStep('confirm')
        }
    }
    async function confirmDeleteItem(){
        setLoading(true);
        const res = await deleteItemPermanentlyAction(item.id);
        setLoading(false);
        setResponse(res);
    }
    return(
        <div className="flex flex-col shadow-lg bg-white rounded-lg">
            <div className="w-full min-h-48 grid grid-cols-12 gap-1  rounded-t-lg border-b">
               <div className="col-span-3 grid grid-rows-5 px-2 pt-2">
                    <div className="row-span-4  overflow-hidden rounded-lg flex items-center"><Image src={item.photo} alt="" className="hover:scale-105 transition-all duration-300" width={800} height={200}/></div>
                    <div className="px-2 self-center flex gap-2">Request : <div className="text-green-500">{item.requestCount}</div></div>
               </div>
                <div className="col-span-7  my-2 flex flex-col gap-1">
                    <div className="font-semibold text-3xl  px-2 text-gray-700 flex justify-between">
                        <div>{item.title}</div>
                        <div className="hover:text-blue-500 cursor-pointer"><EditIcon></EditIcon></div>
                    </div>
                    <div className="h-full  px-2 py-1 text-gray-500">{item.description}</div>
                    <div className="flex flex-row justify-between px-2 text-gray-700">
                        <div className="">Posted : {item.time}</div>
                        <div className="font-semibold text-lg">Rs. {item.price}</div>
                    </div>
                </div>
                <div className="col-span-2 text-center w-full h-full flex flex-col justify-between  items-center px-2 py-2 hover:bg-red-200 rounded-md transition-all duration-500 active:scale-95 cursor-pointer active:bg-red-300" onClick={(e) => {deleteItem();e.stopPropagation()}}>
                    <div></div>
                    <DeleteIcon></DeleteIcon>
                    <div>Remove Item</div>
                </div>
            </div>
            <div className={` w-full overflow-hidden rounded-b-lg ${show?"h-fit":"h-0"} transition-all duration-500`}>
                {item.requestCount > 0 && 
                    item.Buyer.map((buyer_req) => {
                        return (
                            <Request key={buyer_req.buy_id} buyer = {buyer_req} show ={show} item_id = {item.id}></Request>
                        )
                    })
                }
            </div>
            <div className="bg-purple-100 flex justify-between items-center hover:bg-purple-200 cursor-pointer" onClick={() => {if(item.requestCount > 0){setShow(!show)}}}>
                <div className="flex justify-center items-center gap-3">
                    <div className={`h-8 w-1 bg-purple-600 ${show?"":"rounded-bl-lg"} transition-all duration-700`}></div>
                    <div>{show?"Close Panel":item.requestCount == 0? "No requests":"View requests"}</div>
                </div>
                <div className="px-3">{show?<UpChevron></UpChevron>:<DownChevelron></DownChevelron>}</div>
            </div>
            <BackgroundSupporter hide ={step == null}></BackgroundSupporter>
            {step == 'confirm' && 
            <div className="fixed z-50 w-1/5 h-fit px-2 py-2 bg-white rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2">
                <div className="text-xl text-center py-6 flex justify-center items-center">Confirm Reject</div>
                <Success success = {response.success} message={response.message}></Success>
                <Error success = {response.success} message={response.message}></Error>
                <div className="flex gap-2 justify-center">
                    <button className="bg-gray-500 w-full text-white px-8 py-2 rounded-lg active:scale-95 transition-all duration-150 hover:bg-gray-600" onClick={(e) => {setStep(null);e.stopPropagation()}}>Cancel</button>
                    <button className="bg-red-500 w-full text-white px-8 py-2 rounded-lg active:scale-95 transition-all duration-150 hover:bg-red-600" onClick={(e) => {confirmDeleteItem();e.stopPropagation()}}>{loading?"Loading...":"Delete Item"}</button>
                </div>
            </div>}
        </div>
    )
}

type Buyer_Req = {
    buy_id : string,
    buyer_id: string;
    message: string;
    buyer_contact: string;
    buyer_name: string;
}

type BackendResponse = {
    success : boolean | null,
    message : string
}
function Request({buyer,show,item_id} : {buyer : Buyer_Req,show : boolean,item_id : string}){
    const [step,setStep] = useState<string|null>(null)
    const [response,setResponse] = useState<BackendResponse>({
        success : null,
        message : ""
    })
    const[loading,setLoading] = useState(false)
    function rejectBuyer(){
        if(step == null){
            setStep('confirm_reject')
        }
    }
    function sellItem(){
        if(step == null){
            setStep('confirm_sell')
        }
    }
    async function confirmReject(){
        setLoading(true);
        const res = await rejectBuyerFromBuying(buyer.buy_id);
        setLoading(false);
        setResponse(res);

    }
    async function confirmSell(){
        setLoading(true);
        const res = await confirmSellAction({buyer_id : buyer.buyer_id,item_id : item_id});
        setLoading(false);
        setResponse(res)
    }
    return(
        <div className="min-h-20 w-full border-b grid grid-cols-3">
            <div className="col-span-2 flex flex-col px-4 py-2">
                <div className="text-xl font-semibold">Buyer : {buyer.buyer_name}</div>
                <div className="text-gray-600">Contact : {buyer.buyer_contact}</div>
                <div className="text-gray-600">{buyer.message}</div>
                <div className="self-end text-gray-500 font-medium">5 mins ago</div>
            </div>
            <div className="grid-cols-1  flex justify-center items-center gap-8">
                <button className="bg-green-500 text-white px-8 py-2 rounded-lg active:scale-95 transition-all duration-150 hover:bg-green-600" onClick={(e) => {sellItem();e.stopPropagation()}}>Sell Item</button>
                <button className="bg-red-500 text-white px-8 py-2 rounded-lg active:scale-95 transition-all duration-150 hover:bg-red-600" onClick={(e) => {rejectBuyer();e.stopPropagation()}}>Reject</button>
            </div>
            <BackgroundSupporter hide ={step == null}></BackgroundSupporter>
            {
                step == 'confirm_reject' && show && 
                <div className="fixed z-50 w-1/5 shadow-lg h-fit px-2 py-2 bg-white rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2">
                    <div className="text-xl text-center py-6 flex justify-center items-center">Confirm Reject</div>
                    <Success success = {response.success} message={response.message}></Success>
                    <Error success = {response.success} message={response.message}></Error>
                    <div className="flex gap-2 justify-center">
                        <button className="bg-gray-500 w-full text-white px-8 py-2 rounded-lg active:scale-95 transition-all duration-150 hover:bg-gray-600" onClick={(e) => {setStep(null);e.stopPropagation()}}>Cancel</button>
                        <button className="bg-red-500 w-full text-white px-8 py-2 rounded-lg active:scale-95 transition-all duration-150 hover:bg-red-600" onClick={(e) => {confirmReject();e.stopPropagation()}}>{loading?"Loading...":"Reject"}</button>
                    </div>
                </div>
            }

            {
                step == 'confirm_sell' && show && 
                <div className="fixed z-50 w-1/5 h-fit px-2 py-2 shadow-lg bg-white rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2">
                    <div className="text-xl text-center py-6 flex justify-center items-center">Confirm Sell</div>
                    <Success success = {response.success} message={response.message}></Success>
                    <Error success = {response.success} message={response.message}></Error>
                    <div className="flex gap-2 justify-center">
                        <button className="bg-gray-500 w-full text-white px-8 py-2 rounded-lg active:scale-95 transition-all duration-150 hover:bg-gray-600" onClick={(e) => {setStep(null);e.stopPropagation()}}>Cancel</button>
                        <button className="bg-green-500 w-full text-white px-8 py-2 rounded-lg active:scale-95 transition-all duration-150 hover:bg-green-600" onClick={(e) => {confirmSell();e.stopPropagation()}}>{loading?"Loading...":"Sell"}</button>
                    </div>
                </div>
            }
        </div>
    )
}