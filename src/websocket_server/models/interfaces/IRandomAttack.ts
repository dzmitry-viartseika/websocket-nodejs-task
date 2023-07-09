import {Type} from "../../constants/enums/Type";

export interface IRandomAttack {
    type: typeof Type.RANDOM_ATTACK;
    data: {
        gameID: number;
        indexPlayer: number;
    };
    id: number;
}