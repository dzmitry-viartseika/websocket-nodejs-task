import { Type } from '../../constants/enums/Type';

export interface IRequestReg {
    type: typeof Type.REG;
    data: {
        name: string;
        password: string;
    };
    id: number;
}

export interface IResponseReg {
    type: typeof Type.REG;
    data: {
        name: string;
        index: number;
        error: boolean;
        errorText: string;
    };
    id: number;
}