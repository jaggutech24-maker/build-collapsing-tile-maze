import type { LevelData } from './types';

// Each level is a "perfect maze" (a spanning tree of the grid graph) which
// mathematically guarantees that exactly one non-backtracking path connects
// the start cell to the exit. Every other branch is a dead end: a tempting
// detour that strands the player once the tiles behind them collapse.
//
// Data was generated with a seeded randomized-DFS maze generator and
// verified with a brute-force path counter (exactly 1 path to the exit per
// level) before being hand-checked for a fair difficulty curve.

export const LEVELS: LevelData[] = [
  {
    id: 'level-1',
    title: 'The First Step',
    rows: 6,
    cols: 6,
    start: [0, 0],
    end: [3, 2],
    grid: [
      [13, 5, 3, 13, 1, 3],
      [9, 3, 12, 3, 10, 10],
      [10, 12, 3, 10, 14, 10],
      [8, 3, 14, 10, 9, 2],
      [10, 12, 3, 10, 10, 10],
      [12, 7, 12, 4, 6, 14],
    ],
    hintBudget: 2,
    solution: [
      [0, 0], [0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
      [5, 2], [4, 2], [4, 1], [3, 1], [3, 0], [2, 0], [1, 0], [1, 1], [2, 1],
      [2, 2], [3, 2],
    ],
  },
  {
    id: 'level-2',
    title: 'No Way Back',
    rows: 8,
    cols: 8,
    start: [0, 0],
    end: [0, 4],
    grid: [
      [11, 9, 5, 3, 13, 5, 1, 7],
      [12, 6, 11, 12, 5, 3, 12, 3],
      [11, 9, 0, 7, 9, 6, 9, 6],
      [12, 6, 10, 9, 6, 11, 8, 3],
      [9, 5, 2, 10, 9, 2, 10, 10],
      [10, 13, 6, 10, 14, 8, 6, 10],
      [8, 5, 3, 12, 3, 12, 7, 10],
      [12, 7, 12, 5, 4, 5, 5, 6],
    ],
    hintBudget: 2,
    solution: [
      [0, 0], [1, 0], [1, 1], [0, 1], [0, 2], [0, 3], [1, 3], [1, 4], [1, 5],
      [2, 5], [2, 4], [3, 4], [3, 3], [4, 3], [5, 3], [6, 3], [6, 4], [7, 4],
      [7, 5], [7, 6], [7, 7], [6, 7], [5, 7], [4, 7], [3, 7], [3, 6], [2, 6],
      [2, 7], [1, 7], [1, 6], [0, 6], [0, 5], [0, 4],
    ],
  },
  {
    id: 'level-3',
    title: 'Point of No Return',
    rows: 10,
    cols: 10,
    start: [0, 0],
    end: [2, 0],
    grid: [
      [11, 13, 3, 9, 1, 5, 1, 5, 5, 7],
      [12, 3, 12, 2, 10, 9, 6, 9, 5, 3],
      [11, 12, 3, 14, 10, 14, 9, 6, 11, 10],
      [8, 7, 12, 3, 12, 5, 4, 5, 2, 10],
      [12, 5, 3, 12, 5, 5, 3, 13, 6, 10],
      [9, 5, 4, 7, 9, 3, 12, 5, 3, 10],
      [8, 5, 5, 3, 10, 12, 5, 3, 12, 2],
      [10, 11, 9, 2, 12, 3, 11, 8, 3, 10],
      [12, 2, 10, 12, 7, 10, 10, 10, 14, 10],
      [13, 6, 12, 5, 5, 4, 6, 12, 5, 6],
    ],
    hintBudget: 3,
    solution: [
      [0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2], [3, 3], [4, 3], [4, 4],
      [4, 5], [4, 6], [5, 6], [5, 7], [5, 8], [6, 8], [6, 9], [7, 9], [8, 9],
      [9, 9], [9, 8], [9, 7], [8, 7], [7, 7], [6, 7], [6, 6], [6, 5], [5, 5],
      [5, 4], [6, 4], [7, 4], [7, 5], [8, 5], [9, 5], [9, 4], [9, 3], [9, 2],
      [8, 2], [7, 2], [7, 3], [6, 3], [6, 2], [6, 1], [6, 0], [5, 0], [5, 1],
      [5, 2], [4, 2], [4, 1], [4, 0], [3, 0], [2, 0],
    ],
  },
];
