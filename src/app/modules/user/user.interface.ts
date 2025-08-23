import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    RIDER = "RIDER",
    DRIVER = "DRIVER"
}
export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}
export enum isActive {
    ACTIVE= "ACTIVE",
    INACTIVE="INACTICE",
    BLOCKED="BLOCKED"
}
export interface IUser {
    name: string;
    email: string;
    phone?: string;
    picture?:string;
    address?:string;
    password?: string;
    role: Role;
    auths: IAuthProvider[];
    // isBlocked?: boolean;
    isDeleted?:boolean;
    isActive?:isActive;
    isVerified?: boolean;
    bookings?:Types.ObjectId[];
    drivers?:Types.ObjectId[];
    // createdAt: Date;
    // updatedAt: Date;
    
}