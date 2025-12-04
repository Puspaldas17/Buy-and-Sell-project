'use server'
import { changePassSchema } from "@/schema";
import prisma from "../../db"
import bcrypt from "bcrypt"

type ChangePassType = {
    password : string,
    confirmPass : string,
    otpToken : string
}

export async function ChangePassword({password,confirmPass,otpToken}: ChangePassType){
    const format = changePassSchema.safeParse({password,confirmPass});
    if(format.success){
        const userWithOtpDetails = await prisma.otpTable.findFirst({
            where : {
                token : otpToken
            },
            include : {
                user : true
            }
        })
        if(userWithOtpDetails && userWithOtpDetails.user.password){
            if(!userWithOtpDetails.isVerified){
                return {
                    success : false,
                    message : "Invalid token error!"
                }
            }
            const oldNewEqual = await bcrypt.compare(password,userWithOtpDetails.user.password);
            if(oldNewEqual){
                return{
                    success : false,
                    message : "New password should not match with the old Password"
                }
            }else{
                try {
                    const newPass = await bcrypt.hash(password,10);
                    await prisma.user.update({
                        data : {
                            password : newPass
                        },
                        where : {
                            id : userWithOtpDetails.userId
                        }
                    })
                    return{
                        success : true,
                        message : "Password changed Successfully"
                    }
                } catch (error) {
                    console.log(error)
                    return{
                        success : false,
                        message : "Something went wrong!"
                    }
                }
            }
        }else{
            return {
                success : false,
                message : "Invalid token error!"
            }
        }
    }else{
        return{
            success : false,
            message : "Password and Confirm Password should be same!"
        }
    }
}