import { ShipType } from '../../constants/enums/ShipType';

export interface IShip {
    position: {
        x: number;
        y: number;
    };
    direction: boolean;
    length: number;
    type: ShipType;
}