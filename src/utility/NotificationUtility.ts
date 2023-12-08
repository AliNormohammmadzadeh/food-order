

export const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))

    return { otp , expiry}
}

export const onRequestOTP = async(otp: number , toPhoneNumber: string) => {
    const accountSid = "AC2d3e14fffa14392183314fea27059557"
    const authToken = "9bd8e328c8900e058649558814ec4963"
    const client = require("twilio")(accountSid,authToken)

    const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: "+12526490078",
        to: `+98${toPhoneNumber}`
    })

    return response
}