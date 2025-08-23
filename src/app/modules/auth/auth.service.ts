import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import AppError from '../../errorHelpers/AppError';

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist")
    }
     const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

     if(!isPasswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
     }

     return {
        email: isUserExist.email
     }
}

export const AuthServices = {
    credentialsLogin
}