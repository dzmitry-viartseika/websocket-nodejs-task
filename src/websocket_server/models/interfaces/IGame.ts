import { IUser } from './IUser';

export interface IGame {
    stage: string;
    idGame: string;
    gameUsers: IUser[];
}