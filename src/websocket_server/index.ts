import { WebSocketServer } from 'ws';
import { CreateHandlers } from './handlers/create-handlers';
import { IWSStateClient } from './models/interfaces/IWSStateClient';
import { SERVER_CLOSED } from './constants/constants';

export class CreateWebSocketServer {
    public wss: WebSocketServer;
    protected handlers: CreateHandlers;
    constructor(public port: number) {
        this.port = port;
        this.wss = new WebSocketServer({ port });

        this.createListener();
    }

    private createListener(): void {
        this.wss.on('connection', (wsClient: IWSStateClient) => {
            new CreateHandlers(this.wss).clientConnection(wsClient);
        });
        this.wss.on('close', this.serverClose);
    }

    public serverClose = (): void => {
        console.log(SERVER_CLOSED);
    };
}