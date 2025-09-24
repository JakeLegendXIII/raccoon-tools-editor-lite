/**
 * Enum for base player types
 */
export enum BasePlayerType {
    Paladin = 0,
    Fighter = 1,
    Ship = 2
}

/**
 * Enum for base enemy types
 */
export enum BaseEnemyType {
    Grunt = 0,
    Cannon = 1,
    Melee = 2,
    Ship = 3,
    Boss = 4
}

/**
 * Enum for obstacle types
 */
export enum ObstacleType {
    Mountain = 0,
    Water = 1,
    Building = 2,
    Wall = 3
}

/**
 * Enum for Level Types
 */
export enum LevelType {
    Deathmatch = 0,
    Survive = 1,
    Escape = 2,
    Boss = 3
}

/**
 * Represents a point in the level grid
 */
export class LevelPoint {
    X: number = 0;
    Y: number = 0;
}

/**
 * Represents player data in a level
 */
export class PlayerData {
    ID: number = 0;
    PlayerType: number = 0;
    Health: number = 0;
    Height: number = 0;
    Width: number = 0;
    StartPosition: LevelPoint = new LevelPoint();
    StartPositionsList: LevelPoint[] = [];
}

/**
 * Represents enemy data in a level
 */
export class EnemyData {
    ID: number = 0;
    EnemyType: number = 0;
    Health: number = 0;
    Height: number = 0;
    Width: number = 0;
    StartPosition: LevelPoint = new LevelPoint();
}

/**
 * Represents obstacle data in a level
 */
export class ObstacleData {
    ID: number = 0;
    Health: number = 0;
    Height: number = 0;
    Width: number = 0;
    ObstacleType: number = 0;
    IsWalkable: boolean = false;
    IsDestructible: boolean = false;
    Position: LevelPoint = new LevelPoint();
}

/**
 * Represents a game level with all its properties and entities
 */
export class Level {
    ID: number = 0;

    GridWidth: number = 0;
    GridHeight: number = 0;
    CellSize: number = 0;
    LevelType: number = 0;
    LevelDescription: string = '';
    NumberOfTurns: number = 0;
    WinPosition: LevelPoint = new LevelPoint();

    Players: PlayerData[] = [];
    Enemies: EnemyData[] = [];
    Obstacles: ObstacleData[] = [];
}