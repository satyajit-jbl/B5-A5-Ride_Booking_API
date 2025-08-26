/* eslint-disable @typescript-eslint/no-non-null-assertion */


import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import AppError from '../../errorHelpers/AppError';
import { createNewAccessTokenWithRefreshToken, createUserToken } from '../../utils/userTokens';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';




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

   const userToken = createUserToken(isUserExist);

     //delete password
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const {password: pass, ...rest} = isUserExist.toObject();

     return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
     }
}
const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

     return {
        accessToken: newAccessToken
       
     }
}

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) =>{
    const user = await User.findById(decodedToken.userId)
    const isOldpassword = await bcryptjs.compare(oldPassword, user!.password as string)
    if(!isOldpassword){
        throw new AppError(httpStatus.BAD_REQUEST, "Old password does not match")
    }
    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save();
}
export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}