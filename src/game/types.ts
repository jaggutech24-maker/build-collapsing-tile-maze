// Core types for the "Crumbling Maze" game.

/** A wall mask bit for each side of a cell. 1 = wall present (blocked), 0 = open. */
export const WALL_TOP = 1;
export const WALL_RIGHT = 2;
export const WALL_BOTTOM = 4;
export const WALL_LEFT = 8;

export type Coord = [row: number, col: number];

export interface LevelData {
  id: string;
  title: string;
  rows: number;
  cols: number;
  start: Coord;
  end: Coord;
  /** rows x cols grid of wall bitmasks */
  grid: number[][];
  /** number of hints the player may use on this level */
  hintBudget: number;
  /** the one and only non-backtracking solution path, start -> end inclusive */
  solution: Coord[];
}

export type GamePhase =
  | 'start'
  | 'playing'
  | 'trapped'
  | 'level-complete'
  | 'game-complete';

export interface MoveFeedback {
  id: number;
  type: 'blocked' | 'collapsed' | 'advance' | 'hint' | 'win' | 'trapped';
  message: string;
}
