'use server'
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../lib/auth";
import prisma from "../../db";

export async function deleteItemPermanentlyAction(item_id : string){
    const session = await getServerSession(NEXT_AUTH);
    if(!session.user){
        return {
            success : false,
            message :'Unauthorised user!'
        }
    }
    try {
        const deleted = await prisma.$transaction(async (tnx) => {
            await tnx.item.update({
                where : {
                    id : item_id
                },
                data : {
                    deleted : true
                }
            })

            await tnx.buy.updateMany({
                where : {
                    item_id : item_id
                },
                data : {
                    status : 'failed'
                }
            })
            return true
        })
        if(deleted){
            return {
                success : true,
                message : "Deleted Successfully!"
            }
        }
    } catch (error) {
        console.log(error)
        return{
            success : false,
            message : "Something went down!"
        }
    }
    return{
        success : false,
        message : "Something went down!"
    }

}