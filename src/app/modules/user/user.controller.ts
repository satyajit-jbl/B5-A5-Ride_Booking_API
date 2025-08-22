/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";


const createUser = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        // throw new Error("Fake error ... throw")
        // throw new AppError(httpStatus.BAD_REQUEST, "Fake Error")
        const user = await UserServices.createUser(req.body)

        res.status(httpStatus.CREATED).json({
            message: "User created Successfully",
            user
        })
    } catch (err: any) {
        console.log(err);
        next(err);
        // res.status(httpStatus.BAD_REQUEST).json({
        //     message: `Something Went Wrong !!!! ${err.message} from user controller`,
        //     err
        // })
    }
}

const getAllUsers = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const users = await UserServices.getAllUsers();

        res.status(httpStatus.OK).json({
            message: "All users retrived successfully",
            users
        })
    } catch (err) {
        console.log(err);
        next(err);
    }
}
export const UserControllers = {
    createUser,
    getAllUsers
}