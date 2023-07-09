import {Type} from '../../constants/enums/Type';
import {Status} from '../../constants/enums/Status';

export interface IRequestAttack {
    type: typeof Type.ATTACK;
    data: {
        gameID: number;
        x: number;
        y: number;
        indexPlayer: number;
    };
    id: number;
}

export interface IResponseReg {
    type: typeof Type.ATTACK;
    data: {
        position: {
            x: number;
            y: number;
        };
        currentPlayer: number;
        status: Status;
    };
    id: number;
}