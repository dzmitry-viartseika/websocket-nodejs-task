import {Type} from "../../constants/enums/Type";

export interface IAddUserToRoom {
    type: typeof Type.ADD_USER_TO_ROOM;
    data: {
        indexRoom: string;
    };
    id: number;
}