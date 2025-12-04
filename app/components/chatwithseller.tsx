'use client'
import { useState } from "react"
import BackgroundSupporter from "./BackgroundSupporter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSellerFormat, ContactSellerSchema } from "@/schema";
import Success from "./success";
import Error from "./error";
import { messageSeller } from "../action/messageSeller";

export default function ChatWithSeller({seller_name,i_am_seller,item_id} : {seller_name : string,item_id : string ,i_am_seller : boolean}){
    const[step,setStep] = useState<string | null>(null)
    function handelNextStep(){
        if(!i_am_seller){
            if(step == null){
                setStep('message');
            }else if(step == 'message'){
                setStep(null)
            }
        }else{
            alert("Can't message to self")
        }
    }
    function closePopup(){
        if(step == 'message'){
            setStep(null);
        }
    }
    return(
        <div className="w-full min-h-32 bg-white rounded-lg shadow-lg border flex flex-row">
            <div className="h-full w-1 bg-[#ac70ff] rounded-l-lg"></div>
            <div className="w-full h-full flex flex-col px-2 py-2 gap-3">
                <div className="text-3xl font-semibold text-gray-700 self-center">Contact Seller</div>
                <div className="text-xl font-bold font-mono text-gray-800">{seller_name}</div>
                <button className="bg-[#ac70ff] py-3 rounded-lg hover:bg-[#9c55ff] text-white text-lg" 
                    onClick={() => {handelNextStep()}}
                >Message Seller</button>
            </div>
            <BackgroundSupporter hide = {step == null}></BackgroundSupporter>
            {step == 'message' && 
                <SendMessage seller_name = {seller_name} closePopup = {closePopup} item_id = {item_id}></SendMessage>
            }
        </div>
    )
}


type BackendResponse ={
    success : boolean | null,
    message : string
}

function SendMessage({seller_name,closePopup ,item_id} : {seller_name : string,closePopup : () => void , item_id : string}){
    const[response,setResponse] = useState<BackendResponse>({
        success : null,
        message : ""
    })
    const [loading,setLoading] = useState(false)
    const {register , formState : {errors},handleSubmit} = useForm<ContactSellerFormat>({resolver : zodResolver(ContactSellerSchema)})
    async function onFormSubmit(data : ContactSellerFormat){
        setLoading(true);
        const res = await messageSeller({item_id : item_id,message : data.message,contact : data.contact});
        setResponse(res);
        setLoading(false);

    }
    return (
        <div className="w-1/3 h-fit gap-4 bg-white top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 z-50 fixed rounded-lg px-4 py-4 flex flex-col shadow-xl">
            <div className="self-center text-2xl font-semibold text-gray-700">Message {seller_name}</div>
            <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit(onFormSubmit)}>
                <textarea 
                    {...register('message')}
                    placeholder="Write a message . . ." 
                    className="h-28 border hover:border-purple-500 rounded-lg outline:border-red-700 outline-1 outline-purple-500 px-4 py-2">
                </textarea>
                {errors.message && (
                    <div className="text-red-600">
                        {errors.message.message}
                    </div>
                )}
                <div className="flex flex-col gap-3">
                    <div className="text-gray-800 ">Enter your contact info.</div>
                    <div className="relative">
                        <input
                        {...register('contact')}
                        placeholder="Phone or email"
                        className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                        {errors.contact && (
                            <div className="text-red-600">
                                {errors.contact.message}
                            </div>
                        )}
                        <label
                            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Phone or Email
                        </label>
                    </div>
                </div>
                <Success success = {response.success} message={response.message}></Success>
                <Error success = {response.success} message={response.message}></Error>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-400 hover:bg-gray-500 rounded-lg active:scale-95 transition-all duration-150 flex justify-center items-center" onClick={(e) => {closePopup();e.stopPropagation()}}>Cancel</div>
                    <button className="bg-[#ac70ff] py-3 rounded-lg hover:bg-[#9c55ff] text-white text-lg active:scale-95 transition-all duration-150">{loading?"Loading...":"Send Message"}</button>
                </div>
            </form>
        </div>
    )
}