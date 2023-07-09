import { DataRequest } from '../types/DataRequest';
import { Type } from '../../constants/enums/Type';
import {Status} from "../../constants/enums/Status";

export interface IBasePacket {
    type: any;
    data: string | DataRequest;
    id: number;
}