'use server'
import  prisma  from "../../db";
import { signinSchema } from "@/schema"

export async function LoginUser(data : {email : string , password : string}){
    const format = signinSchema.safeParse(data);
    if(format.success){
        try {
            const user = await prisma.user.findFirst({
                where : {
                    email : data.email
                }
            })
            if(user){
                if(!user.isEmailVerified){
                    return{
                        success : false,
                        message : "Email not verified!"
                    }
                }else{
                    return{
                        success : true,
                        message : "verified",
                    }
                }
            }else{
                return{
                    success : false,
                    message : "Wrong Credentials!"
                }
            }
        } catch (error) {
            console.log(error)
            return{
                success : false,
                message : "Something went wrong!"
            }
        }
    }
    else{
        return{
            success : false,
            message : "Invalid credentials!"
        }
    }
}