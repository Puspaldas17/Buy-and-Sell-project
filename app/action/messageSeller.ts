'use server'
import prisma from "../../db";
import { ContactSellerSchema } from "@/schema"
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";

export async function messageSeller(data : {item_id : string,message : string,contact : string}){
    const format = ContactSellerSchema.safeParse({message : data.message,contact : data.contact});
    const session = await getServerSession(NEXT_AUTH)
    if(format.success){
        if(!session.user.id){
            return {
                success : false,
                message : "Invalid token error"
            }
        }
        try {
            const item = await prisma.item.findFirst({
                where : {
                    id : data.item_id
                },
                
            })
            if(item){
                try {
                    const user = await prisma.buy.findFirst({
                        where : {
                            AND : [
                                {
                                    item_id : item.id
                                },
                                {
                                    buyer_Id : session.user.id
                                }
                            ]
                        }
                    })
                    try {
                        await prisma.buy.upsert({
                            where : {
                                id : user?.id || "1"
                            },
                            update : {
                                message : data.message,
                                contact : data.contact,
                                status : 'pending'
                            },
                            create : {
                                item_id : data.item_id,
                                message : data.message,
                                buyer_Id : session.user.id,
                                contact : data.contact,
                                time : new Date()
                            }
                        })
                        return {
                            success : true,
                            message : "Message sent successfully!"
                        }
                    } catch (error) {
                        console.log(error)
                        return {
                            success : false,
                            message : "Something went down!"
                        }
                    }
                } catch (error) {
                    console.log(error)
                    return {
                        success : false,
                        message : "Something went down!"
                    }
                }
                
            }else{
                return {
                    success : false,
                    message : "Invalid token error"
                }
            }
        } catch (error) {
            console.log(error)
            return {
                success : false,
                message : "Something went down!"
            }
        }
    }else{
        return {
            success : false,
            message : "Invalid input!"
        }
    }
}