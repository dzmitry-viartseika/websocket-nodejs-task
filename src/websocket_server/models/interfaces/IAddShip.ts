import { Type } from '../../constants/enums/Type';
import { IShip } from './IShip';

export interface IAddShip {
    type: typeof Type.ADD_SHIPS;
    data: {
        gameId: string;
        ships: Ship[];
        indexPlayer: string;
    };
    id: number;
}