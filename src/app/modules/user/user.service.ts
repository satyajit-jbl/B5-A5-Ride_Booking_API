import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';

const createUser = async(payload: Partial<IUser>) => {
    const {email, password, ...rest} = payload;

    const isUserExist = await User.findOne({email})

    if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, 10)
    const authProvider: IAuthProvider = {provider: "credentials", providerId: email as string}
        const user = await User.create({
            email,
            password: hashedPassword,
            auths: [authProvider],
            ...rest
        })

        return user
}

const updateUser = async(userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) =>{

    const isUserExist = await User.findById(userId)
    if(!isUserExist){
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    
if(payload.role){
    if(decodedToken.role===Role.RIDER || decodedToken.role===Role.DRIVER){
        throw new AppError(httpStatus.FORBIDDEN, "Your are not authorised")
    }
    if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
        throw new AppError(httpStatus.FORBIDDEN, "Your are not authorised")
    }
}

if(payload.isActive || payload.isDeleted || payload.isVerified){
    if(decodedToken.role ===Role.RIDER || decodedToken.role===Role.DRIVER){
        throw new AppError(httpStatus.FORBIDDEN, "Your are not authorised")
    }
}
if(payload.password){
    payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
 
}
const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {new :true, runValidators: true})

return newUpdatedUser

}

const getAllUsers = async()=>{
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}

export const UserServices = {
    createUser,
    getAllUsers,
    updateUser
}