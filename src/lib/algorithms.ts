import { PathfindingResult } from '@/types/pathfinding';

class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.items.shift()?.element;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const getNeighbors = (row: number, col: number, gridSize: number) => {
  const neighbors: { row: number; col: number }[] = [];
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }

  return neighbors;
};

const reconstructPath = (
  cameFrom: Map<string, { row: number; col: number }>,
  current: { row: number; col: number }
): { row: number; col: number }[] => {
  const path: { row: number; col: number }[] = [current];
  let currentKey = `${current.row},${current.col}`;

  while (cameFrom.has(currentKey)) {
    const prev = cameFrom.get(currentKey)!;
    path.unshift(prev);
    currentKey = `${prev.row},${prev.col}`;
  }

  return path;
};

export const dijkstra = (
  grid: string[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): PathfindingResult => {
  const gridSize = grid.length;
  const visited = new Set<string>();
  const visitedOrder: { row: number; col: number }[] = [];
  const distances = new Map<string, number>();
  const cameFrom = new Map<string, { row: number; col: number }>();
  const pq = new PriorityQueue<{ row: number; col: number }>();

  const startKey = `${start.row},${start.col}`;
  distances.set(startKey, 0);
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const current = pq.dequeue()!;
    const currentKey = `${current.row},${current.col}`;

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);
    visitedOrder.push(current);

    if (current.row === end.row && current.col === end.col) {
      return {
        visitedOrder,
        path: reconstructPath(cameFrom, current),
        found: true
      };
    }

    const neighbors = getNeighbors(current.row, current.col, gridSize);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      if (grid[neighbor.row][neighbor.col] === 'wall' || visited.has(neighborKey)) {
        continue;
      }

      const newDistance = (distances.get(currentKey) || 0) + 1;
      if (!distances.has(neighborKey) || newDistance < distances.get(neighborKey)!) {
        distances.set(neighborKey, newDistance);
        cameFrom.set(neighborKey, current);
        pq.enqueue(neighbor, newDistance);
      }
    }
  }

  return { visitedOrder, path: [], found: false };
};

const heuristic = (a: { row: number; col: number }, b: { row: number; col: number }): number => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

export const astar = (
  grid: string[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): PathfindingResult => {
  const gridSize = grid.length;
  const visited = new Set<string>();
  const visitedOrder: { row: number; col: number }[] = [];
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, { row: number; col: number }>();
  const pq = new PriorityQueue<{ row: number; col: number }>();

  const startKey = `${start.row},${start.col}`;
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(start, end));
  pq.enqueue(start, fScore.get(startKey)!);

  while (!pq.isEmpty()) {
    const current = pq.dequeue()!;
    const currentKey = `${current.row},${current.col}`;

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);
    visitedOrder.push(current);

    if (current.row === end.row && current.col === end.col) {
      return {
        visitedOrder,
        path: reconstructPath(cameFrom, current),
        found: true
      };
    }

    const neighbors = getNeighbors(current.row, current.col, gridSize);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      if (grid[neighbor.row][neighbor.col] === 'wall' || visited.has(neighborKey)) {
        continue;
      }

      const tentativeGScore = (gScore.get(currentKey) || 0) + 1;
      if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)!) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, end));
        pq.enqueue(neighbor, fScore.get(neighborKey)!);
      }
    }
  }

  return { visitedOrder, path: [], found: false };
};

export const bfs = (
  grid: string[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): PathfindingResult => {
  const gridSize = grid.length;
  const visited = new Set<string>();
  const visitedOrder: { row: number; col: number }[] = [];
  const queue: { row: number; col: number }[] = [start];
  const cameFrom = new Map<string, { row: number; col: number }>();

  visited.add(`${start.row},${start.col}`);

  while (queue.length > 0) {
    const current = queue.shift()!;
    visitedOrder.push(current);

    if (current.row === end.row && current.col === end.col) {
      return {
        visitedOrder,
        path: reconstructPath(cameFrom, current),
        found: true
      };
    }

    const neighbors = getNeighbors(current.row, current.col, gridSize);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      if (grid[neighbor.row][neighbor.col] === 'wall' || visited.has(neighborKey)) {
        continue;
      }

      visited.add(neighborKey);
      cameFrom.set(neighborKey, current);
      queue.push(neighbor);
    }
  }

  return { visitedOrder, path: [], found: false };
};

export const dfs = (
  grid: string[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): PathfindingResult => {
  const gridSize = grid.length;
  const visited = new Set<string>();
  const visitedOrder: { row: number; col: number }[] = [];
  const stack: { row: number; col: number }[] = [start];
  const cameFrom = new Map<string, { row: number; col: number }>();

  while (stack.length > 0) {
    const current = stack.pop()!;
    const currentKey = `${current.row},${current.col}`;

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);
    visitedOrder.push(current);

    if (current.row === end.row && current.col === end.col) {
      return {
        visitedOrder,
        path: reconstructPath(cameFrom, current),
        found: true
      };
    }

    const neighbors = getNeighbors(current.row, current.col, gridSize);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      if (grid[neighbor.row][neighbor.col] === 'wall' || visited.has(neighborKey)) {
        continue;
      }

      if (!cameFrom.has(neighborKey)) {
        cameFrom.set(neighborKey, current);
      }
      stack.push(neighbor);
    }
  }

  return { visitedOrder, path: [], found: false };
};
