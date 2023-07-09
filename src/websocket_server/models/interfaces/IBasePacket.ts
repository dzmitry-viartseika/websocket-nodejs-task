import { DataRequest } from '../types/DataRequest';

export interface IBasePacket {
    type: any;
    data: string | DataRequest;
    id: number;
}