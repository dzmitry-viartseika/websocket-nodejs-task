import { RawData, WebSocketServer } from 'ws';
import { DataField } from "../constants/enums/DataField";
import { IWSStateClient } from '../models/interfaces/IWSStateClient';
import { CreateDataHandlers } from './create-data-handlers';

export class CreateHandlers {
    public wsClient: IWSStateClient;
    public wsServer: WebSocketServer;
    private dataHandlers: CreateDataHandlers;

    constructor(wsServer: WebSocketServer) {
        this.wsServer = wsServer;
    }

    public clientConnection(wsClient: IWSStateClient): void {
        this.wsClient = wsClient;
        this.dataHandlers = new CreateDataHandlers(wsClient, this.wsServer);
        wsClient.on('error', console.error);

        wsClient.on('message', this.message);
        wsClient.on('close', this.disconnect);

        wsClient.send('WebSocketServer ready to connect');
    }

    private message = (webSocketData: RawData): void => {
        const data = JSON.parse(webSocketData.toString());

        const isValidData = this.validWebSocketData(data);

        if (isValidData) {
            const webSocketDataResponse = this.dataHandlers.webSocketDataHandler(data);

            if (webSocketDataResponse) {
                this.wsClient.send(webSocketDataResponse);
            }
        }
    };

    private disconnect = (): void => {
        console.log('WebSocket client disconnect');
    };

    private validWebSocketData = (wsClientData: unknown): boolean => {
        const templateDataFields = Object.values(DataField);
        if (wsClientData && typeof wsClientData === 'object') {
            const keys = Object.keys(wsClientData);
            if (templateDataFields.length === keys.length) {
                return templateDataFields.every((templateDataField) => templateDataField in wsClientData);
            }

            return false;
        }
        return false;
    };
}