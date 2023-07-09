
import { IRequestReg } from '../interfaces/IResponseReg';
import { ICreateNewRoom } from '../interfaces/ICreateNewRoom';
import { IAddShip } from '../interfaces/IAddShip';
import { IRandomAttack } from '../interfaces/IRandomAttack';
import { IAddUserToRoom } from '../interfaces/IAddUserToRoom';
import { IRequestAttack } from "../interfaces/IAttack";

export type DataRequest =
    | IRequestReg['data']
    | ICreateNewRoom['data']
    | IAddUserToRoom['data']
    | IAddShip['data']
    | IRequestAttack['data']
    | IRandomAttack['data'];