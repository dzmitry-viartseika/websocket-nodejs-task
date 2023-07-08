export type Commands = [string, string, number?, number?];

export enum Modules {
    MOUSE = "MOUSE",
    DRAW = "DRAW",
    PRINT = "PRINT",
}

export enum MouseCommands {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    UP = "UP",
    DOWN = "DOWN",
    POSITION = "POSITION",
}

export enum DrawCommands {
    SQUARE = "SQUARE",
    RECTANGLE = "RECTANGLE",
    CIRCLE = "CIRCLE",
}

export interface ICoordinates {
    x: number;
    y: number;
}