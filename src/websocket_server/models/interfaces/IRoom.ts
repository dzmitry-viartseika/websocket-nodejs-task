import { IUser } from './IUser';

export interface IRoom {
    roomId: string;
    roomUsers: IUser[];
}