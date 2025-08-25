/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/AppError"
import { setAuthCookie } from "../../utils/setCookie"


const credentialsLogin = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

      const loginInfo = await AuthServices.credentialsLogin(req.body);

      setAuthCookie(res, loginInfo);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: loginInfo
        })
})
const getNewAccessToken = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new AppError (httpStatus.BAD_REQUEST, "No Refresh Token received from cookies")
    }
      const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string);

     setAuthCookie(res, tokenInfo);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "New Access Token Retrived Successfully",
            data: tokenInfo
        })
})
const logout = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged out Successfully",
            data: null
        })
})

export const AuthControllers ={
    credentialsLogin,
    getNewAccessToken,
    logout
}