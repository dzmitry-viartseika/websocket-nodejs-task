import { DataRequest } from '../models/types/DataRequest';
import { CreateResponseHandlers } from './create-response-handlers';
import WebSocket, { WebSocketServer } from 'ws';
import { IAddShip } from "../models/interfaces/IAddShip";
import { ICreateNewRoom } from "../models/interfaces/ICreateNewRoom";
import { IResponseValidPlayer } from "../models/interfaces/IResponseValidPlayer";
import { IAddUserToRoom } from "../models/interfaces/IAddUserToRoom";
import { IBasePacket } from "../models/interfaces/IBasePacket";
import {IRequestReg, IResponseReg} from "../models/interfaces/IResponseReg";
import { IWSStateClient } from "../models/interfaces/IWSStateClient";
import { Type } from '../constants/enums/Type';

export class CreateDataHandlers {
    public clientState: IWSStateClient;
    protected responseHandlers: CreateResponseHandlers;
    protected wsServer: WebSocketServer;

    constructor(wsClient: IWSStateClient, wsServer: WebSocketServer) {
        this.clientState = wsClient;
        this.wsServer = wsServer;
        this.responseHandlers = new CreateResponseHandlers(wsClient);
    }
    public webSocketDataHandler = (requestWebSocketData: IBasePacket): string | void => {
        switch (requestWebSocketData.type) {
            case Type.REG: {
                const webSocketData: DataRequest =
                    typeof requestWebSocketData.data === 'string'
                        ? JSON.parse(requestWebSocketData.data)
                        : requestWebSocketData.data;

                return this.responseHandlers.registrationPlayerHandler(this.isValidData<IRequestReg['data']>(webSocketData));
            }
            case Type.CREATE_ROOM: {
                const webSocketData = requestWebSocketData.data;
                const clients = this.wsServer.clients as Set<IWSStateClient>;
                const validData = this.isValidData<ICreateNewRoom['data']>(webSocketData);

                if (typeof validData !== 'string') {
                    return JSON.stringify({ type: Type.CREATE_ROOM, ...validData });
                }

                const rooms = this.responseHandlers.createRoomHandler(validData);
                for (const client of clients) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(rooms);
                    }
                }
                return;
            }

            case Type.ADD_USER_TO_ROOM: {
                const webSocketData: DataRequest =
                    typeof requestWebSocketData.data === 'string'
                        ? JSON.parse(requestWebSocketData.data)
                        : requestWebSocketData.data;

                const validDataOrError = this.isValidData<IAddUserToRoom['data']>(webSocketData);
                if ('error' in validDataOrError) {
                    return JSON.stringify({
                        ...this.responseHandlers.createErrorObject(validDataOrError),
                        type: Type.ADD_USER_TO_ROOM,
                    });
                }

                const game = this.responseHandlers.createGameHandler(validDataOrError);

                if (!game) {
                    return JSON.stringify({
                        type: Type.ADD_USER_TO_ROOM,
                        error: true,
                        errorText: 'Cannot add user to own room, please wait opponent',
                    });
                }

                const clients = this.wsServer.clients as Set<IWSStateClient>;
                const rooms = this.responseHandlers.updateRoomHandler();

                for (const client of clients) {
                    if (client.readyState === WebSocket.OPEN && client.playerInfo.roomId === this.clientState.playerInfo.roomId) {
                        client.playerInfo.idGame = this.clientState.playerInfo.idGame;
                        client.send(game);
                        client.send(rooms);
                    } else if (client.readyState === WebSocket.OPEN) {
                        client.send(rooms);
                    }
                }

                return;
            }
            case Type.ADD_SHIPS: {
                const webSocketData: DataRequest =
                    typeof requestWebSocketData.data === 'string'
                        ? JSON.parse(requestWebSocketData.data)
                        : requestWebSocketData.data;

                const validDataOrError = this.isValidData<IAddShip['data']>(webSocketData);
                if ('error' in validDataOrError) {
                    return JSON.stringify({
                        ...this.responseHandlers.createErrorObject(validDataOrError),
                        type: Type.ADD_SHIPS,
                    });
                }

                const ship = this.responseHandlers.addShipsHandler(validDataOrError);

                if (!ship) {
                    return JSON.stringify({
                        type: Type.ADD_SHIPS,
                        error: true,
                        errorText: 'Invalid data',
                    });
                }

                if (ship === 'not ready') {
                    return;
                } else if (ship) {
                    const clients = this.wsServer.clients as Set<IWSStateClient>;

                    for (const client of clients) {
                        if (
                            client.readyState === WebSocket.OPEN &&
                            client.playerInfo.idGame === this.clientState.playerInfo.idGame
                        ) {
                            client.send(client.playerInfo.startPosition);
                            const currentPlayer = client.playerInfo.currentPlayer;
                            const currentPlayerResponse = this.responseHandlers.updateCurrentPlayerHandler(currentPlayer);
                            client.send(currentPlayerResponse);
                        }
                    }
                }

                return;
            }

            default: {
                break;
            }
        }
        return 'create';
    };

    protected isValidData = <T extends DataRequest>(webSocketData: DataRequest): T | IResponseValidPlayer => {
        const data = webSocketData;

        if (
            data &&
            typeof data === 'object' &&
            'name' in data &&
            typeof data.name === 'string' &&
            data.name.length >= 5 &&
            'password' in data &&
            typeof data.password === 'string' &&
            data.password.length >= 5
        ) {
            return webSocketData as T;
        }

        if (typeof data === 'string') {
            return webSocketData as T;
        }

        if (data && typeof data === 'object' && 'indexRoom' in data) {
            return webSocketData as T;
        }

        if (
            data &&
            typeof data === 'object' &&
            'gameId' in data &&
            typeof data.gameId === 'string' &&
            'ships' in data &&
            Array.isArray(data.ships) &&
            'indexPlayer' in data &&
            typeof data.indexPlayer === 'string'
        ) {
            return webSocketData as T;
        }

        return { error: true, errorText: 'Invalid data' };
    };
}