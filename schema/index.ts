import zod, { string } from "zod"
export const signupSchema = zod.object({
    firstname : zod.string({invalid_type_error : "Firstname should be of type String"}).min(1,{
        message : "firstname cannot be empty"
    }),
    lastname : zod.string({invalid_type_error : "Lastname should be of type String"}),
    password : zod.string().min(8,{message : "Password should be min of 8 characters"}),
    email : zod.string().email()
})


export const signinSchema = zod.object({
    email : zod.string().email(),
    password : zod.string().min(8,{message : "Password should be min of 8 characters"})
})
export const otpSchema = zod.object({
    otp : zod.string().length(6,{message : "Otp must be of 6 digits"})
})
export const emailSchema = zod.object({
    email : zod.string().email(),
})
export const changePassSchema = zod.object({
    password : zod.string().min(8,{message : "Password should be min of 8 characters"}),
    confirmPass : zod.string().min(8,{message : "Password should be min of 8 characters"})
}).refine((data) => {
    if(data.password == data.confirmPass){
        return true;
    }
    return false;
},{message : "Password and confirm Pass should match"});
export const addMoneySchema = zod.object({
    amount : zod.string().min(1,{message : "This Field is required"}).refine((money) => {
        for(var i = 0 ; i < money.length ; i++){
            if(!(Number(money.charAt(i)) >= 0 && Number(money.charAt(i)) <= 9)){
                return false;
            }
            return true;
        }
    },{message : "Amount must be a number"}).refine((data) => {
        if(Number(data.charAt(0)) == 0){
            return false;
        }
        return true;
    }),
    bankName : zod.string({required_error : "This field is required"}).min(1,{message : "Bank cannot be Empty"}),
})
export const p2pTransferToPhoneSchema = zod.object({
    amount : zod.string().min(1,{message : "This Field is required"}).refine((money) => {
        for(var i = 0 ; i < money.length ; i++){
            if(!(Number(money.charAt(i)) >= 0 && Number(money.charAt(i)) <= 9)){
                return false;
            }
            return true;
        }
    },{message : "Amount must be a number"}).refine((data) => {
        if(Number(data.charAt(0)) == 0){
            return false;
        }
        return true;
    }),
    phone : zod.string().length(10,{message : "length must be 10"}).refine((data) => {
        for(let i = 0; i < data.length ; i++){
            if((Number(data.charAt(i)) >= 0 && Number(data.charAt(i)) <= 9)){
                return true;
            }
            return false;
        }
        return true;
    },{message : "Phone number should only contain numbers."}),
    tpin : zod.string().length(6,{message : "Tpin must be of length 6!"})
})








export const EditAddressSchema = zod.object({
    address : zod.string().max(20,{message : "Address cannot be more than 20 chars"}).min(1),
    city : zod.string().max(15,{message : "Too long name"}).min(1),
    country : zod.string().max(15,{message : "Too long name"}).min(1),
    pincode : zod.string().max(8,{message : "Pincode must be of 8 digits"}).refine((data) => {
        let regex = /^[0-9]+/;
        if(data.match(regex)){
            return true;
        }
        return false;
    })
})



export const ReportProblemSchema = zod.object({
    tnxId : zod.string().min(1,{message : "Transaction ID cannot be empty"}),
    subject : zod.string().min(1,{message : "Subject cannot be empty"}),
    body : zod.string().min(1,{message : "body cannot be empty"})
})


export const newOtpSchema = zod.object({
    otp1 : zod.string().length(1).refine((data) => {
        return (Number(data) >= 0 && Number(data) <= 9)
    }),
    otp2 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    }),
    otp3 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    }),
    otp4 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    }),
    otp5 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    }),
    otp6 : zod.string().length(1).refine((data) => {
        return (Number(data) >=0 && Number(data) <= 9)
    })
})
const phoneSchema = zod.string().length(10,{message : "length must be 10"}).refine((data) => {
    for(let i = 0; i < data.length ; i++){
        if((Number(data.charAt(i)) >= 0 && Number(data.charAt(i)) <= 9)){
            return true;
        }
        return false;
    }
    return true;
},{message : "Phone number should only contain numbers."})

export const ContactSellerSchema = zod.object({
    message : zod.string().min(1),
    contact : zod.union([zod.string().email(),phoneSchema])
})



export const newItemSchema = zod.object({
    title : zod.string().min(1),
    description : zod.string().min(1),
    price : zod.string().min(1,{message : "This Field is required"}).refine((money) => {
        for(var i = 0 ; i < money.length ; i++){
            if(!(Number(money.charAt(i)) >= 0 && Number(money.charAt(i)) <= 9)){
                return false;
            }
            return true;
        }
    }),
})




export type ContactSellerFormat = zod.infer<typeof ContactSellerSchema>
export type newItemFromat = zod.infer<typeof newItemSchema>;
export type SignupFormat = zod.infer<typeof signupSchema>;
export type SigninFormat = zod.infer<typeof signinSchema>;
export type otpFormat = zod.infer<typeof otpSchema>;
export type emailFormat = zod.infer<typeof emailSchema>;
export type changePassFormat = zod.infer<typeof changePassSchema>;
export type addMoneyFormat = zod.infer<typeof addMoneySchema>;
export type p2pTransferToPhoneFormat = zod.infer<typeof p2pTransferToPhoneSchema>;

export type EditAddressFormat = zod.infer<typeof EditAddressSchema>;

export type ReportProblemFormat = zod.infer<typeof ReportProblemSchema>;
export type newOtpFormat = zod.infer<typeof newOtpSchema>
