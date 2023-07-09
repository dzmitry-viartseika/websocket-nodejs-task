import { randomUUID } from 'node:crypto';
import { Type } from '../constants/enums/Type';
import { IRoom } from '../models/interfaces/IRoom';
import { IGame } from '../models/interfaces/IGame';
import {IAddShip} from '../models/interfaces/IAddShip';
import { ICreateGame } from '../models/interfaces/ICreateGame';
import { IResponseError } from '../models/interfaces/IResponseError';
import { ICreateNewRoom } from '../models/interfaces/ICreateNewRoom';
import { IResponseReg } from '../models/interfaces/IResponseReg';
import { IDataUser } from '../models/interfaces/IDataUser';
import { IUser } from '../models/interfaces/IUser';
import { IResponseValidPlayer } from '../models/interfaces/IResponseValidPlayer';
import { IWSStateClient } from '../models/interfaces/IWSStateClient';
import {IAddUserToRoom} from "../models/interfaces/IAddUserToRoom";

const usersData: IDataUser[] = [];

const rooms: IRoom[] = [];

const games: IGame[] = [];
export class CreateResponseHandlers {
    public clientState: IWSStateClient;
    constructor(wsClient: IWSStateClient) {
        this.clientState = wsClient;
    }
    public registrationPlayerHandler = (webSocketData: any | IResponseValidPlayer): string => {
        if ('error' in webSocketData) {
            return JSON.stringify(this.createErrorObject(webSocketData));
        }

        const { name, password } = webSocketData;

        const newUser = {
            name: name,
            password: password,
        };

        usersData.push(newUser);

        this.clientState.playerInfo = {
            ...newUser,
            index: randomUUID(),
            roomId: '',
            idGame: '',
            ships: [],
            startPosition: '',
            currentPlayer: '',
        };

        const dataObjectPlayerResponse = {
            type: Type.REG,
            data: JSON.stringify({
                name: name,
                index: this.clientState.playerInfo.index,
                error: false,
                errorText: '',
            }),
            id: 0,
        };

        return JSON.stringify(dataObjectPlayerResponse);
    };

    public createRoomHandler = (webSocketData: ICreateNewRoom['data'] | IResponseValidPlayer): string => {
        if (typeof webSocketData === 'string') {
            const { index, name } = this.clientState.playerInfo;
            const roomId = randomUUID();
            this.clientState.playerInfo.roomId = roomId;

            const room: IRoom = {
                roomId,
                roomUsers: [
                    {
                        name: name,
                        index,
                    },
                ],
            };
            rooms.push(room);

            const dataObjectUpdateRoomResponse = {
                type: Type.UPDATE_ROOM,
                data: JSON.stringify(rooms),
                id: 0,
            };

            return JSON.stringify(dataObjectUpdateRoomResponse);
        }
        return JSON.stringify(this.createErrorObject(webSocketData));
    };

    public createGameHandler = (webSocketData: IAddUserToRoom['data']): string => {
        const { index, name } = this.clientState.playerInfo;
        const { indexRoom: roomId } = webSocketData;
        const idGame = randomUUID();

        const game: ICreateGame['data'] = {
            idGame,
            idPlayer: index,
        };

        if (this.clientState.playerInfo.roomId === roomId) {
            return '';
        }

        this.clientState.playerInfo.roomId = roomId;
        this.clientState.playerInfo.idGame = idGame;

        const indexRoomInBase = rooms.findIndex((room) => room.roomId === roomId);

        rooms[indexRoomInBase]?.roomUsers.push({ index, name });
        const gameUsers = rooms[indexRoomInBase]?.roomUsers as IUser[];

        // enemyUser.
        games.push({ stage: 'prepare', idGame, gameUsers });
        rooms.splice(indexRoomInBase, 1);

        const dataObjectCreateGameResponse = {
            type: Type.CREATE_GAME,
            data: JSON.stringify(game),
            id: 0,
        };

        return JSON.stringify(dataObjectCreateGameResponse);
    };

    public addShipsHandler = (webSocketData: IAddShip['data']): string => {
        const { index, idGame } = this.clientState.playerInfo;
        const { gameId, indexPlayer, ships } = webSocketData;
        const indexGameInBase = games.findIndex((game) => game.idGame === gameId);

        console.log('index', index);
        console.log('indexPlayer', indexPlayer);

        if (idGame === gameId) {
            this.clientState.playerInfo.ships = ships;
            this.clientState.playerInfo.currentPlayer = indexPlayer;

            console.log('stage', games[indexGameInBase]?.stage);
            const isStageReady = games[indexGameInBase]?.stage === 'ready';

            if (isStageReady) {
                const dataObjectStartGameResponse = {
                    type: Type.START_GAME,
                    data: JSON.stringify({ ships, currentPlayerIndex: index }),
                    id: 0,
                };
                this.clientState.playerInfo.startPosition = JSON.stringify(dataObjectStartGameResponse);
                return JSON.stringify(dataObjectStartGameResponse);
            }

            if (games[indexGameInBase]) {
                (games[indexGameInBase] as IGame).stage = 'ready';
                const dataObjectStartGameResponse = {
                    type: Type.START_GAME,
                    data: JSON.stringify({ ships, currentPlayerIndex: index }),
                    id: 0,
                };
                this.clientState.playerInfo.startPosition = JSON.stringify(dataObjectStartGameResponse);
                return 'not ready';
            }
        }
        return '';
    };

    public updateCurrentPlayerHandler = (currentPlayer: string): string => {
        const dataObjectUpdateRoomResponse = {
            type: Type.TURN,
            data: JSON.stringify({ currentPlayer }),
            id: 0,
        };

        return JSON.stringify(dataObjectUpdateRoomResponse);
    };

    public updateRoomHandler = (): string => {
        const dataObjectUpdateRoomResponse = {
            type: Type.UPDATE_ROOM,
            data: JSON.stringify(rooms),
            id: 0,
        };

        return JSON.stringify(dataObjectUpdateRoomResponse);
    };

    public createErrorObject = (data: IResponseValidPlayer): IResponseError => {
        return {
            type: Type.REG,
            data: JSON.stringify({
                name: '',
                index: '',
                error: true,
                errorText: data.errorText,
            }),
            id: 0,
        };
    };
}