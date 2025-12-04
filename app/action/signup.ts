'use server'
import bcrypt from "bcrypt";
import { sendMail } from "../../lib/gmail";
import crypto from "crypto"
import { SignupFormat, signupSchema } from "@/schema";
import prisma from "../../db";

export async function CreateNewAccount(user : SignupFormat){
    const format = signupSchema.safeParse(user);
    if(format.success){
        try {
            const userExist = await prisma.user.findFirst({
                where : {
                    email : user.email
                }
            })
            if(userExist){
                return{
                    success : false,
                    message : "User already exist"
                }
            }
            const hashedPass = await bcrypt.hash(user.password,10);
            let randomOtp = '';
            for(let i = 0 ; i < 6 ; i++){
                randomOtp += Math.floor(Math.random()*10);
            }
            const otpExpiryTime = Date.now() + 5*60*1000 + '';
            const otpToken = crypto.randomUUID();
            try {
                const otpTable = await prisma.$transaction(async (tnx) => {
                    const newUser = await tnx.user.create({
                        data : {
                            firstname : user.firstname,
                            lastname : user.lastname,
                            email : user.email,
                            password : hashedPass,
                        }
                    })

                    const otpTable = await tnx.otpTable.create({
                        data : {
                            userId : newUser.id,
                            otp : randomOtp,
                            otpExpiry : otpExpiryTime,
                            token : otpToken
                        }
                    })
                    return otpTable
                })
        
                //send email
                const result = await sendMail({email : user.email,otp : randomOtp})
                console.log("email send log")
                console.log(result)
                if(result.accepted){
                    return{
                        success : true,
                        message : "OTP send to email",
                        otpToken : otpTable.token
                    }
                }else{
                    return{
                        success : false,
                        message : "Trouble in sending OTP. Verify email via Login"
                    }
                }
            } catch (error) {
                console.log(error)
                return{
                    success : false,
                    message : "Something went wrong!"
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
            message : "Invalid Inputs"
        }
    }
}