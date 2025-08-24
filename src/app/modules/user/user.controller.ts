import { JwtPayload } from 'jsonwebtoken';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";


// const createUser = async (req: Request, res: Response, next: NextFunction)=>{
//     try {
//         // throw new Error("Fake error ... throw")
//         // throw new AppError(httpStatus.BAD_REQUEST, "Fake Error")
//         const user = await UserServices.createUser(req.body)

//         res.status(httpStatus.CREATED).json({
//             message: "User created Successfully",
//             user
//         })
//     } catch (err: any) {
//         console.log(err);
//         next(err);
//         // res.status(httpStatus.BAD_REQUEST).json({
//         //     message: `Something Went Wrong !!!! ${err.message} from user controller`,
//         //     err
//         // })
//     }
// }

const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const user = await UserServices.createUser(req.body)

        // res.status(httpStatus.CREATED).json({
        //     message: "User created Successfully",
        //     user
        // })
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User created Successfully",
            data: user
        })
})
const updateUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const userId = req.params.id;
    const token = req.headers.authorization
    const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const payload= req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken)

        // res.status(httpStatus.CREATED).json({
        //     message: "User created Successfully",
        //     user
        // })
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User updated Successfully",
            data: user
        })
})

const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const result = await UserServices.getAllUsers();

//    res.status(httpStatus.OK).json({
//             message: "All Users retrived Successfully",
//             users
//         })
sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "All Users retrived Successfully",
            data: result.data,
            meta: result.meta
        })
})

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser
}