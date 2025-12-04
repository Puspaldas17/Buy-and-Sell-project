'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import Error from "@/app/components/error";
import Success from "@/app/components/success";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import { changePasswordPopupAtom } from "@/store";
import { ShootMailForPassChange } from "../action/shootMail";
import BackIcon from "./backIcon";
import Button from "./button";
import Loader from "./loader";
import { changePassFormat, changePassSchema, emailFormat, emailSchema, newOtpFormat, newOtpSchema } from "@/schema";
import { verifyingOtpForChangePass } from "../action/verifyOtp";
import { ChangePassword } from "../action/changepass";



function BackgroundSupporter({hide} : {hide : boolean}){
    return(
        <div className={`w-screen z-10 fixed top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 h-full duration-300 ${hide?"opacity-0 pointer-events-none":"opacity-100 backdrop-brightness-50"}`} onClick={(e) => {e.stopPropagation()}}>  
        </div>
    )
} 

export default function ForgotPassword({setMainStep} : {setMainStep : Dispatch<SetStateAction<string | null>>}){
    const[step,setStep] = useState<string | null>('email');
    const setChangePasswordPopup = useSetRecoilState(changePasswordPopupAtom)
    function handleNextStep(){
        if(step == 'email'){
            setStep('otp')
        }else if(step == 'otp'){
            setStep('password')
        }else if(step == 'password'){
            //jab step null hoga to i want ki main step bhi null ho jae.
            setStep(null);
            setMainStep(null);
        }
    }
    function handlePreviousStep(){
        if(step == 'email'){
            setStep(null);
            setMainStep(null);
        }else if(step == 'otp'){
            setStep('email')
        }else if(step == 'password'){
            setStep('otp')
        }
    }
    function closePopup(){
        setStep(null);
        setMainStep(null);
    }

    useEffect(() => {
        if(step == null){
            setChangePasswordPopup(null)
        }
    },[step,setChangePasswordPopup])
    return(
        <>
        <BackgroundSupporter hide = {step == null}></BackgroundSupporter>
        {step == "email" && <SendEmailPopup onSuccess = {handleNextStep} onBack = {handlePreviousStep} onClose = {closePopup}></SendEmailPopup>}
        {step == 'otp' && <VerifyOtpPopup onSuccess = {handleNextStep} onBack = {handlePreviousStep} onClose = {closePopup}></VerifyOtpPopup>}
        {step == 'password' && <ChangePasswordPopup onSuccess = {handleNextStep} onBack = {handlePreviousStep} onClose = {closePopup}></ChangePasswordPopup>}
        </>
    )
}


type BackendResponseWithToken = {
    success : boolean | null,
    message : string,
    otpToken : string | null
}


function SendEmailPopup({onSuccess,onBack,onClose} : {onClose : () => void,onSuccess : () => void,onBack : () => void}){
    const[response,setResponse] = useState<BackendResponseWithToken>({
        success : null,
        message : "",
        otpToken : null
    })
    const[loading,setLoading] = useState(false)
    const setChangePasswordPopup = useSetRecoilState(changePasswordPopupAtom);
    const {register,handleSubmit,formState : {errors}} = useForm<emailFormat>({resolver : zodResolver(emailSchema)});
    async function onFormSubmit(data : emailFormat){
        setLoading(true);
        const res = await ShootMailForPassChange(data) as BackendResponseWithToken;
        setResponse(res);
        setLoading(false);
        if(res.success){
            setChangePasswordPopup({email : data.email,token : res.otpToken,otp : null});
            setTimeout(() => {
                onSuccess()
            }, 1500);
        }
    } 
    return(
        <div className="fixed z-20 top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 w-1/3 bg-white shadow-black shadow-xl py-3 px-4 rounded-lg" onClick={(e) => {e.stopPropagation()}}>
            <div className="border-b-2 py-2 px-2 text-lg font-medium flex justify-between">
                <div>Send Verification email</div>
                <div onClick={(e) => {onBack();e.stopPropagation()}} className="hover:text-blue-700 cursor-pointer">
                    <BackIcon></BackIcon>
                </div>
            </div>
            <form  onSubmit = {handleSubmit(onFormSubmit)} className="rounded-b-lg pt-4 flex flex-col gap-4">
                <div className="relative">
                    <input placeholder="example@gmail.com"
                    disabled = {loading}
                    {...register("email")}
                    className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                    {errors.email && (
                        <div className="text-red-600">
                            {errors.email.message}
                        </div>
                    )}
                    <label
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Enter Email
                    </label>
                </div>
                <div>
                {loading && <div className="py-2 transition-all scale-75"><Loader></Loader></div>}
                    <Success message={response.message} success = {response.success}></Success>
                    <Error message={response.message} success = {response.success}></Error>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="bg-slate-300 hover:bg-slate-400 w-full py-3 rounded-lg active:scale-95 transition-all text-center" aria-disabled = {loading} onClick={(e) => {setResponse({success : null,message : "",otpToken : null});onClose();setChangePasswordPopup(null);e.stopPropagation()}}>Cancel</div>
                    <Button loading = {loading} text = {"Send email"}></Button>
                </div>
            </form>
        </div>
    )
}



type BackendResponse = {
    success : boolean| null,
    message : string
}

function VerifyOtpPopup({onSuccess,onBack,onClose} : {onClose : () => void,onSuccess : () => void,onBack : () => void}){
    const[response,setResponse] = useState<BackendResponse>({
        success : null,
        message : "",
    })
    const[loading,setLoading] = useState(false)
    const [changePasswordPopup,setChangePasswordPopup] = useRecoilState(changePasswordPopupAtom);
    const {register,handleSubmit} = useForm<newOtpFormat>({resolver : zodResolver(newOtpSchema)});
    async function onFormSubmit(data : newOtpFormat){
        setLoading(true);
        const res = await verifyingOtpForChangePass({otp : data.otp1 + data.otp2 + data.otp3 + data.otp4 + data.otp5 + data.otp6,otpToken : changePasswordPopup?.token || ""}) as BackendResponse;
        setResponse(res);
        setLoading(false);
        if(res.success){
            setTimeout(() => {
                onSuccess()
            }, 1500);
        }
    }
    
    return(
        <div className="fixed z-20 top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 w-1/3 bg-white shadow-black shadow-xl py-3 px-4 rounded-lg" onClick={(e) => {e.stopPropagation()}}>
            <div className="border-b-2 py-2 px-2 text-xl font-medium flex justify-between">
                <div>Enter OTP</div>
                <div onClick={(e) => {onBack();e.stopPropagation()}} className="hover:text-blue-700 cursor-pointer">
                    <BackIcon></BackIcon>
                </div>
            </div>
            <form  onSubmit={handleSubmit(onFormSubmit)}  className="rounded-b-lg pt-4 flex flex-col gap-4">
                <div className="flex flex-row justify-center gap-4">
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("otp1")}  maxLength={1} minLength={0}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("otp2")} maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("otp3")} maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("otp4")} maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("otp5")} maxLength={1}/>
                    <input type="text" className="h-12 w-12 border border-black rounded-lg text-xl text-center focus:outline-blue-600 transition-all focus:scale-105" {...register("otp6")} maxLength={1} />
                </div>
                <div>
                {loading && <div className="py-2 transition-all scale-75"><Loader></Loader></div>}
                    <Success message={response.message} success = {response.success}></Success>
                    <Error message={response.message} success = {response.success}></Error>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="bg-slate-300 hover:bg-slate-400 w-full py-3 rounded-lg active:scale-95 transition-all text-center" aria-disabled = {loading} onClick={(e) => {setResponse({success : null,message : ""});onClose();setChangePasswordPopup(null);e.stopPropagation()}}>Cancel</div>
                    <Button loading = {loading} text = {"Verify OTP"}></Button>
                </div>
            </form>
        </div>
    )
}
















function ChangePasswordPopup({onSuccess,onBack,onClose} : {onClose : () => void,onSuccess : () => void,onBack : () => void}){
    const[response,setResponse] = useState<BackendResponse>({
        success : null,
        message : "",
    })
    const[loading,setLoading] = useState(false)
    const [changePasswordPopup,setChangePasswordPopup] = useRecoilState(changePasswordPopupAtom);
    const {register,handleSubmit,formState : {errors}} = useForm<changePassFormat>({resolver : zodResolver(changePassSchema)});
    async function onFormSubmit(data : changePassFormat){
        setLoading(true);
        const res = await ChangePassword({password : data.password,confirmPass : data.confirmPass,otpToken : changePasswordPopup?.token || ""}) as BackendResponse;
        setResponse(res);
        setLoading(false);
        if(res.success){
            setTimeout(() => {
                onSuccess()
            }, 1500);
        }
    }
    
    return(
        <div className="w-1/3 bg-white shadow-black shadow-xl py-3 px-4 rounded-lg fixed z-20 top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2" onClick={(e) => {e.stopPropagation()}}>
            <div className="border-b-2 py-2 px-2 text-xl font-medium flex justify-between">
                <div>Change Password</div>
                <div onClick={(e) => {onBack();e.stopPropagation()}} className="hover:text-blue-700 cursor-pointer">
                    <BackIcon></BackIcon>
                </div>
            </div>
            <form className="flex flex-col pt-4" onSubmit={handleSubmit(onFormSubmit)}>
                <div className="relative mb-4">
                    <input placeholder="New Password"
                    {...register("password")}
                    type="password"
                    className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                    {errors.password && (
                        <div className="text-red-600">
                            {errors.password.message}
                        </div>
                    )}
                    <label
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        password
                    </label>
                </div>
                <div className="relative mb-4">
                    <input placeholder="Confirm password"
                    type="password"
                    {...register("confirmPass")}
                    className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                    {errors.confirmPass && (
                        <div className="text-red-600">
                            {errors.confirmPass.message}
                        </div>
                    )}
                    <label
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Confirm password
                    </label>
                </div>
                <div>
                    {errors.root && (
                        <div className="text-red-600">
                            {errors.root.message}
                        </div>
                    )}
                </div>
                <div>
                {loading && <div className="py-2 transition-all scale-75"><Loader></Loader></div>}
                    <Success message={response.message} success = {response.success}></Success>
                    <Error message={response.message} success = {response.success}></Error>
                </div>
                <div className="flex flex-row gap-2 pt-4">
                    <div className="bg-slate-300 hover:bg-slate-400 w-full py-3 rounded-lg active:scale-95 transition-all text-center" aria-disabled = {loading} onClick={(e) => {setResponse({success : null,message : ""});onClose();setChangePasswordPopup(null);e.stopPropagation()}}>Cancel</div>
                    <Button loading = {loading} text = {"Change Password"}></Button>
                </div>
            </form>
        </div>
    )
}
