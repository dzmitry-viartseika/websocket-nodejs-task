import { Type } from '../../constants/enums/Type';

export interface ICreateNewRoom {
    type: typeof Type.CREATE_ROOM;
    data: string;
    id: number;
}