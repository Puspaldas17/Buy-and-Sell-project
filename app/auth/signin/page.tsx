'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninFormat, signinSchema } from "@/schema";
import Error from "@/app/components/error";
import Success from "@/app/components/success";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { useForm } from "react-hook-form";
import { LoginUser } from "../../action/login";
import Image from "next/image";
import ForgotPassword from "@/app/components/forgotPassword";
import VerifyEmail from "@/app/components/emailVerification";
import Button from "@/app/components/button";
type BackendResponse = {
    success : boolean | null,
    message : string,
}


export default function SigninPage(){
    const router = useRouter();
    const[loading,setLoading] = useState(false);
    const[step,setStep] = useState<string | null>(null);
    const[response,setResponse] = useState<BackendResponse>({
        message : '',
        success : null,
    });
    const {register,handleSubmit,formState : {errors}} = useForm<SigninFormat>({resolver : zodResolver(signinSchema)});
    async function signinUser(data : SigninFormat){
        setLoading(true)
        const res = await LoginUser(data) as BackendResponse;
        if(res.success){
            //email is verified ... now signin the user by signIn function.
            const signinResponse = await signIn("credentials",{redirect : false,username : data.email,password : data.password});
            if(signinResponse?.ok){
                setTimeout(() => {
                    router.push('/dashboard?page=0')
                }, 1000);
                setResponse({
                    success : true,
                    message : "Logged in Successfully!"
                })
            }else{
                setResponse({
                    success : false,
                    message : "Wrong Credentials!"
                })
            }
            setLoading(false);
        }else{
            //email not verified or wrong credentials.
            setLoading(false);
            setResponse(res);
        }
    }
    return (
        <div className="w-1/3 bg-white px-8 py-8 text-center flex flex-col gap-3 rounded-lg">
            <header className="text-5xl font-serif font-bold text-slate-800">
                Login to Account
            </header>
            <div className="text-gray-600 mb-8">
                Enter your credentials to Login
            </div>
            <form className="flex flex-col" onSubmit={handleSubmit(signinUser)}>
                <div className="relative mb-4">
                    <input placeholder="Email"
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
                        Email
                    </label>
                </div>
                <div className="relative mb-2">
                    <input placeholder="Password" 
                    disabled = {loading}
                    {...register("password")} 
                    type="password"
                    className="peer focus:bg-white  shadow-sm hover:bg-slate-50  w-full rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
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
                <div className="flex flex-row justify-between mb-4">
                    <button className={`text-gray-600  font-medium  mb-2 text-sm ${loading?"":"hover:text-blue-600"}`}
                    type="button"
                    disabled = {loading}
                    onClick={() => {setStep('forgotpass')}}>
                        forgot password?
                    </button>
                    <button className={`text-gray-600  font-medium  mb-2 text-sm ${loading?"":"hover:text-blue-600"}`}
                    type="button"
                    disabled = {loading}
                    onClick={() => {setStep('verifyEmail')}}>
                        email not verified?
                    </button>
                </div>
                <div className="mb-4">
                    <Success message={response.message} success = {response.success}></Success>
                    <Error message={response.message} success = {response.success}></Error>
                </div>
                <Button loading = {loading} text = {"Login"}></Button>
            </form>
            <div className="bg-gray-300 py-2 rounded-md flex justify-center gap-3 hover:bg-gray-400 hover:cursor-pointer"
            //the callback url will ensure to redirect after a successfull login from google
            onClick={() => {signIn("google",{ callbackUrl: '/dashboard?page=0'})}}>
                <Image src={"/google.svg"} alt = {""} className="size-7" width={7} height={7}/>
                <label className="font-semibold">Signup With google</label>
            </div>
            <div className="flex gap-2 self-center text-gray-500 mt-4">
                <div className="font-serif">
                    Do not have an account ?
                </div>
                <div className={`font-serif cursor-pointer hover:text-black ${(!response.success && response.message == 'Wrong Credentials!')?"animate-bounce":""}`} onClick={() => {
                    router.push('/auth/signup')
                }}>
                    Register
                </div>
            </div>
            {step == 'forgotpass' && <ForgotPassword setMainStep = {setStep}></ForgotPassword>}
            {step == 'verifyEmail' && <VerifyEmail setMainStep = {setStep}></VerifyEmail>}
        </div>
    )
}




