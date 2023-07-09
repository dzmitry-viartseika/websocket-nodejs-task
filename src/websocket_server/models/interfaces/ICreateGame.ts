import {Type} from "../../constants/enums/Type";

export interface ICreateGame {
    type: typeof Type.CREATE_GAME;
    data: {
        idGame: string;
        idPlayer: string;
    };
    id: number;
}