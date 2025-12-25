export type CellType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path';

export type DrawMode = 'wall' | 'start' | 'end' | null;

export type AlgorithmType = 'dijkstra' | 'astar' | 'bfs' | 'dfs';

export interface Cell {
  row: number;
  col: number;
  type: CellType;
}

export interface GridState {
  cells: CellType[][];
  startPoint: { row: number; col: number } | null;
  endPoint: { row: number; col: number } | null;
}

export interface PathfindingResult {
  visitedOrder: { row: number; col: number }[];
  path: { row: number; col: number }[];
  found: boolean;
}
