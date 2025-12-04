'use server'
import prisma from "../../db";

export async function verifyingOtpForEmailVerification(data : { otp : string, otpToken : string }){
    try {
        const tokenForEmailVerification = await prisma.otpTable.findFirst({
            where : {
                token : data.otpToken
            },
            include : {
                user : true
            }
        })
        const currTime = Date.now() + 0 + "";
        if(tokenForEmailVerification){
            if(tokenForEmailVerification.user.isEmailVerified){
                return{
                    success : false,
                    message : "Email already Verified"
                }
            }
            if(tokenForEmailVerification.otpExpiry > currTime){
                if(tokenForEmailVerification.otp == data.otp){
                    try {
                        const result = await prisma.$transaction(async (tnx) => {
                            await tnx.user.update({
                                data : {
                                    isEmailVerified : true
                                },
                                where : {
                                    id : tokenForEmailVerification.userId
                                }
                            })

                            await tnx.otpTable.update({
                                where : {
                                    token : data.otpToken
                                },
                                data : {
                                    isVerified: true
                                }
                            })
                            return true
                        })
                        if(result){
                            return{
                                success : true,
                                message : "Email Verified Successfully"
                            }
                        }
                    } catch (error) {
                        console.log(error)
                        return{
                            success : false,
                            message : "Resend otp and try again",
                        }
                    }
                    
                }else{
                    return{
                        success : false,
                        message : "Incorrect OTP",
                    } 
                }
            }else{
                return{
                    success : false,
                    message : "OTP expired. Resend and try again!",
                }
            }
        }else{
            return{
                success : false,
                message : "Invalid Token Error.",
            }
        }
    } catch (error) {
        console.log(error)
        return{
            success : false,
            message : "Invalid Token Error.",
        }
    }
}


export async function verifyingOtpForChangePass(data : { otp : string, otpToken : string }){
    try {
        const tokenForEmailVerification = await prisma.otpTable.findFirst({
            where : {
                token : data.otpToken
            },
            include : {
                user : {
                    select : {
                        isEmailVerified : true
                    }
                }
            }
        })
        const currTime = Date.now() + 0 + "";
        if(tokenForEmailVerification){
            if(!tokenForEmailVerification.user.isEmailVerified){
                return{
                    success : false,
                    message : "Email not Verified"
                }
            }
            if(tokenForEmailVerification.otpExpiry > currTime){
                if(tokenForEmailVerification.otp == data.otp){
                    try {
                        //validating the otp ... means the otp has been verified so that the password can be changed.
                        await prisma.otpTable.update({
                            where : {
                                token : data.otpToken
                            },
                            data : {
                                isVerified : true
                            }
                        })
                        return{
                            success : true,
                            message : "Verified successfully ! Now process to change password",
                        }
                    } catch (error) {
                        console.log(error)
                        return {
                            success : false,
                            message : "Something went wrong!"
                        }
                    }
                }else{
                    return{
                        success : false,
                        message : "Incorrect OTP",
                    } 
                }
            }else{
                return{
                    success : false,
                    message : "OTP expired. Resend and try again!",
                }
            }
        }else{
            return{
                success : false,
                message : "Invalid Token Error.",
            }
        }
    } catch (error) {
        console.log(error)
        return{
            success : false,
            message : "Invalid Token Error.",
        }
    }
}