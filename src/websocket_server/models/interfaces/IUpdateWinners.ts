import { Type } from '../../constants/enums/Type';

export interface IUpdateWinners {
    type: typeof Type.FINISH;
    data: {
        winPlayer: number;
    };
    id: number;
}

export interface UpdateWinners {
    type: typeof Type.START_GAME;
    data: {
        ships: Ship[];
        currentPlayerIndex: number;
    };
    id: number;
}

export interface UpdateWinners {
    type: typeof Type.TURN;
    data: {
        winPlayer: number;
    };
    id: number;
}

export interface UpdateWinners {
    type: typeof Type.UPDATE_ROOM;
    data: [
        {
            roomId: number;
            roomUsers: [
                {
                    name: string;
                    index: number;
                },
            ];
        },
    ];
    id: number;
}

export interface UpdateWinners {
    type: typeof Type.UPDATE_WINNERS;
    data: [
        {
            name: string;
            wins: number;
        },
    ];
    id: number;
}