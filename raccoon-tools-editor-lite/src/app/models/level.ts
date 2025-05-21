/**
 * Represents a point in the level grid
 */
export class LevelPoint {
    x: number = 0;
    y: number = 0;
}

/**
 * Represents player data in a level
 */
export class PlayerData {
    id: number = 0;
    playerType: number = 0;
    health: number = 0;
    height: number = 0;
    width: number = 0;
    startPosition: LevelPoint = new LevelPoint();
}

/**
 * Represents enemy data in a level
 */
export class EnemyData {
    id: number = 0;
    enemyType: number = 0;
    health: number = 0;
    height: number = 0;
    width: number = 0;
    startPosition: LevelPoint = new LevelPoint();
}

/**
 * Represents obstacle data in a level
 */
export class ObstacleData {
    id: number = 0;
    health: number = 0;
    height: number = 0;
    width: number = 0;
    obstacleType: number = 0;
    isWalkable: boolean = false;
    position: LevelPoint = new LevelPoint();
}

/**
 * Represents a game level with all its properties and entities
 */
export class Level {
    id: number = 0;

    numberOfPlayers: number = 0;
    numberOfEnemies: number = 0;

    gridWidth: number = 0;
    gridHeight: number = 0;
    cellSize: number = 0;
    levelType: number = 0;
    levelDescription: string = '';
    numberOfTurns: number = 0;
    winPosition: LevelPoint = new LevelPoint();

    players: PlayerData[] = [];
    enemies: EnemyData[] = [];
    obstacles: ObstacleData[] = [];
}