import WebSocket from 'ws';
import { IShip } from './IShip';

export interface IWSStateClient extends WebSocket {
  playerInfo: {
    name: string;
    password: string;
    index: string;
    roomId: string;
    idGame: string;
    ships: Ship[];
    startPosition: string;
    currentPlayer: string;
  };
}