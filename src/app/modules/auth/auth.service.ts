

import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { isActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import AppError from '../../errorHelpers/AppError';
import { createUserToken } from '../../utils/userTokens';
import { generateToken, verifyToken } from '../../utils/jwt';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

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
        refreshToken: userToken.accessToken,
        user: rest
     }
}
const getNewAccessToken = async (refreshToken: string) => {
    const verifiedAccessToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload
    

    const isUserExist = await User.findOne({ email: verifiedAccessToken.email})

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist")
    }
    if(isUserExist.isActive === isActive.BLOCKED || isUserExist.isActive === isActive.INACTIVE){
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if(isUserExist.isDeleted){
        throw new AppError(httpStatus.BAD_REQUEST, "User is dEleted")
    }
     

  const JwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  }
  const accessToken = generateToken(JwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

     return {
        accessToken
       
     }
}

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken
}