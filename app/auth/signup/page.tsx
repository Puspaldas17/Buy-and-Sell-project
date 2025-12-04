'use client'
import {signupSchema , SignupFormat, newOtpFormat, newOtpSchema} from "@/schema/index"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import Error from "@/app/components/error";
import Success from "@/app/components/success";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { CreateNewAccount } from "@/app/action/signup";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { verifyingOtpForEmailVerification } from "../../action/verifyOtp";
import BackIcon from "@/app/components/backIcon";
import Button from "@/app/components/button";

type TokenBackendResponse = {
    success : boolean | null,
    message : string,
    otpToken : string | null
}


export default function SignupPage(){
    const router = useRouter();
    const[loading,setLoading] = useState(false)
    const[step,setStep] = useState<string | null>(null)
    const[response,setResponse] = useState<TokenBackendResponse>({
        message : '',
        success : null,
        otpToken : null
    });
    function handleNextStep(){
        if(step == null){
            setStep('otp')
        }else if(step == 'otp'){
            setStep(null);
            setResponse({success : true,message : "Proceed to login",otpToken : null})
        }
    }
    function handlePreviousStep(){
        if(step == 'otp'){
            setStep(null)
        }
    }
    const {register,handleSubmit,formState : { errors },reset} = useForm<SignupFormat>({resolver : zodResolver(signupSchema)});
    async function signup(userdata : SignupFormat){
        setLoading(true);
        const res = await CreateNewAccount(userdata) as TokenBackendResponse;
        if(res.success){
            setTimeout(() => {
                handleNextStep();
            }, 1500);
        }
        setResponse(res);
        setLoading(false);
        reset();
    }
    return (
        <div className="w-1/3 bg-white px-8 py-8 text-center flex flex-col gap-3 rounded-lg">
            <header className="text-5xl font-serif font-bold text-slate-800">
                Create Account
            </header>
            <div className="text-gray-600 mb-8">
                Enter your credentials to create new account
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(signup)}>
                <div className="grid grid-cols-2 gap-5">
                <div className="relative">
                    <input placeholder="Firstname"
                    disabled = {loading}
                    className= {`focus:bg-white  peer shadow-sm w-full rounded-md  hover:bg-slate-50 px-3 py-3  transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100`}
                    {...register("firstname")} />
                    {errors.firstname && (
                            <div className="text-red-600">
                                {errors.firstname.message}
                            </div>
                    )}
                    <label
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Firstname
                    </label>
                </div>
                <div className="relative">
                    <input placeholder="Lastname" 
                    disabled = {loading}
                    className="focus:bg-white shadow-sm peer w-full rounded-md hover:bg-slate-50  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100"
                    {...register('lastname')} />
                    {errors.lastname && (
                            <div className="text-red-600">
                                {errors.lastname.message}
                            </div>
                    )}
                    <label
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Lastname
                    </label>
                </div>
                </div>
                <div className="relative">
                    <input placeholder="Email" 
                    disabled = {loading}
                    className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" 
                    {...register("email")}/>
                    {errors.email && (
                            <div className="text-red-600">
                                {errors.email.message}
                            </div>
                    )}
                    <label
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Email
                    </label>
                </div>
                <div className="relative">
                    <input placeholder="Password" 
                    disabled = {loading}
                    type="password"
                    className="peer focus:bg-white  shadow-sm hover:bg-slate-50  w-full rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" 
                    {...register('password')}/>
                    {errors.password && (
                            <div className="text-red-600">
                                {errors.password.message}
                            </div>
                    )}
                    <label
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Password
                    </label>
                </div>
                <div>
                    <Success message={response.message} success = {response.success}></Success>
                    <Error message={response.message} success = {response.success}></Error>
                </div>
                <Button text="Create new Account" loading = {loading}></Button>
            </form>
            <div className="bg-gray-200 py-2 rounded-md flex justify-center gap-3 hover:bg-gray-300 hover:cursor-pointer"
            //the callback url will ensure to redirect after a successfull login from google
            onClick={() => {signIn("google",{ callbackUrl: '/dashboard'})}}>
                <Image src={"/google.svg"} alt = {""} className="size-7" height={0} width={0}/>
                <label className="font-semibold">Signup With google</label>
            </div>
            <div className="flex gap-2 self-center text-gray-500 mt-4">
                <div className="font-serif">
                    Already have an account ?
                </div>
                <div className="font-serif cursor-pointer hover:text-black" onClick={() => {
                    router.push('/auth/signin')
                }}>
                    Login
                </div>
            </div>
            <BackgroundSupporter hide = {step == null}></BackgroundSupporter>
            {step == 'otp' && <VerifyOtpPopup onSuccess = {handleNextStep} onBack = {handlePreviousStep} token = {response.otpToken} setStep={setStep}></VerifyOtpPopup>}
        </div>
    )
}




function BackgroundSupporter({hide} : {hide : boolean}){
    return(
        <div className={`w-screen z-10 fixed top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 h-full duration-300 ${hide?"opacity-0 pointer-events-none":"opacity-100 backdrop-brightness-50"}`} onClick={(e) => {e.stopPropagation()}}>  
        </div>
    )
} 


type BackendResponse = {
    success : boolean| null,
    message : string
}

function VerifyOtpPopup({onSuccess,onBack,setStep,token} : {onSuccess : () => void,onBack : () => void,setStep : Dispatch<SetStateAction<string | null>>,token : string | null}){
    const[response,setResponse] = useState<BackendResponse>({
        success : null,
        message : "",
    })
    const[loading,setLoading] = useState(false)
    const {register,handleSubmit} = useForm<newOtpFormat>({resolver : zodResolver(newOtpSchema)});
    async function onFormSubmit(data : newOtpFormat){
        setLoading(true);
        const res = await verifyingOtpForEmailVerification({otp : data.otp1 + data.otp2 + data.otp3 + data.otp4 + data.otp5 + data.otp6,otpToken : token || ""}) as BackendResponse;
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
                    <Success message={response.message} success = {response.success}></Success>
                    <Error message={response.message} success = {response.success}></Error>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="bg-slate-300 hover:bg-slate-400 w-full py-3 rounded-lg active:scale-95 transition-all text-center" aria-disabled = {loading} onClick={(e) => {setResponse({success : null,message : ""});setStep(null);e.stopPropagation()}}>Cancel</div>
                    <Button loading = {loading} text = {"Verify OTP"}></Button>
                </div>
            </form>
        </div>
    )
}
