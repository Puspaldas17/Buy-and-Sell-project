import { atom } from "recoil";

export const changePasswordPopupAtom = atom<{email : string | null,token : string | null,otp : string | null} | null>({
    key : "key",
    default : null
})

export const verifyEmailPopupAtom = atom<{email : string | null,token : string | null} | null>({
    key : "verifyEmailPopup",
    default : null
})