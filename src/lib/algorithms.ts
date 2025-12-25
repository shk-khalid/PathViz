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

// Greedy Best-First Search - Uses only heuristic, very fast but not optimal
export const greedyBestFirst = (
  grid: string[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): PathfindingResult => {
  const gridSize = grid.length;
  const visited = new Set<string>();
  const visitedOrder: { row: number; col: number }[] = [];
  const cameFrom = new Map<string, { row: number; col: number }>();
  const pq = new PriorityQueue<{ row: number; col: number }>();

  pq.enqueue(start, heuristic(start, end));

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

      if (!cameFrom.has(neighborKey)) {
        cameFrom.set(neighborKey, current);
        pq.enqueue(neighbor, heuristic(neighbor, end));
      }
    }
  }

  return { visitedOrder, path: [], found: false };
};

// Bidirectional BFS - Searches from both start and end simultaneously
export const bidirectionalBfs = (
  grid: string[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): PathfindingResult => {
  const gridSize = grid.length;
  const visitedOrder: { row: number; col: number }[] = [];
  
  // Forward search from start
  const visitedStart = new Set<string>();
  const queueStart: { row: number; col: number }[] = [start];
  const cameFromStart = new Map<string, { row: number; col: number }>();
  visitedStart.add(`${start.row},${start.col}`);
  
  // Backward search from end
  const visitedEnd = new Set<string>();
  const queueEnd: { row: number; col: number }[] = [end];
  const cameFromEnd = new Map<string, { row: number; col: number }>();
  visitedEnd.add(`${end.row},${end.col}`);

  let meetingPoint: { row: number; col: number } | null = null;

  while (queueStart.length > 0 && queueEnd.length > 0) {
    // Expand from start
    if (queueStart.length > 0) {
      const currentStart = queueStart.shift()!;
      visitedOrder.push(currentStart);
      const currentStartKey = `${currentStart.row},${currentStart.col}`;

      if (visitedEnd.has(currentStartKey)) {
        meetingPoint = currentStart;
        break;
      }

      const neighborsStart = getNeighbors(currentStart.row, currentStart.col, gridSize);
      for (const neighbor of neighborsStart) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (grid[neighbor.row][neighbor.col] === 'wall' || visitedStart.has(neighborKey)) {
          continue;
        }
        visitedStart.add(neighborKey);
        cameFromStart.set(neighborKey, currentStart);
        queueStart.push(neighbor);
      }
    }

    // Expand from end
    if (queueEnd.length > 0) {
      const currentEnd = queueEnd.shift()!;
      visitedOrder.push(currentEnd);
      const currentEndKey = `${currentEnd.row},${currentEnd.col}`;

      if (visitedStart.has(currentEndKey)) {
        meetingPoint = currentEnd;
        break;
      }

      const neighborsEnd = getNeighbors(currentEnd.row, currentEnd.col, gridSize);
      for (const neighbor of neighborsEnd) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (grid[neighbor.row][neighbor.col] === 'wall' || visitedEnd.has(neighborKey)) {
          continue;
        }
        visitedEnd.add(neighborKey);
        cameFromEnd.set(neighborKey, currentEnd);
        queueEnd.push(neighbor);
      }
    }
  }

  if (meetingPoint) {
    // Reconstruct path from start to meeting point
    const pathFromStart = reconstructPath(cameFromStart, meetingPoint);
    
    // Reconstruct path from meeting point to end
    let current = meetingPoint;
    let currentKey = `${current.row},${current.col}`;
    const pathToEnd: { row: number; col: number }[] = [];
    
    while (cameFromEnd.has(currentKey)) {
      const next = cameFromEnd.get(currentKey)!;
      pathToEnd.push(next);
      currentKey = `${next.row},${next.col}`;
      current = next;
    }
    
    return {
      visitedOrder,
      path: [...pathFromStart, ...pathToEnd],
      found: true
    };
  }

  return { visitedOrder, path: [], found: false };
};

// Jump Point Search - Optimized A* that skips unnecessary nodes
export const jumpPointSearch = (
  grid: string[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): PathfindingResult => {
  const gridSize = grid.length;
  const visited = new Set<string>();
  const visitedOrder: { row: number; col: number }[] = [];
  const gScore = new Map<string, number>();
  const cameFrom = new Map<string, { row: number; col: number }>();
  const pq = new PriorityQueue<{ row: number; col: number }>();

  const isWalkable = (row: number, col: number): boolean => {
    return row >= 0 && row < gridSize && col >= 0 && col < gridSize && grid[row][col] !== 'wall';
  };

  const jump = (
    row: number,
    col: number,
    dRow: number,
    dCol: number
  ): { row: number; col: number } | null => {
    const nextRow = row + dRow;
    const nextCol = col + dCol;

    if (!isWalkable(nextRow, nextCol)) return null;

    // Found the goal
    if (nextRow === end.row && nextCol === end.col) {
      return { row: nextRow, col: nextCol };
    }

    // Check for forced neighbors (diagonal case)
    if (dRow !== 0 && dCol !== 0) {
      // Diagonal movement
      if (
        (!isWalkable(nextRow - dRow, nextCol) && isWalkable(nextRow - dRow, nextCol + dCol)) ||
        (!isWalkable(nextRow, nextCol - dCol) && isWalkable(nextRow + dRow, nextCol - dCol))
      ) {
        return { row: nextRow, col: nextCol };
      }
      // Check horizontal and vertical directions
      if (jump(nextRow, nextCol, dRow, 0) !== null || jump(nextRow, nextCol, 0, dCol) !== null) {
        return { row: nextRow, col: nextCol };
      }
    } else {
      // Horizontal or vertical movement
      if (dRow !== 0) {
        if (
          (!isWalkable(nextRow, nextCol - 1) && isWalkable(nextRow + dRow, nextCol - 1)) ||
          (!isWalkable(nextRow, nextCol + 1) && isWalkable(nextRow + dRow, nextCol + 1))
        ) {
          return { row: nextRow, col: nextCol };
        }
      } else {
        if (
          (!isWalkable(nextRow - 1, nextCol) && isWalkable(nextRow - 1, nextCol + dCol)) ||
          (!isWalkable(nextRow + 1, nextCol) && isWalkable(nextRow + 1, nextCol + dCol))
        ) {
          return { row: nextRow, col: nextCol };
        }
      }
    }

    return jump(nextRow, nextCol, dRow, dCol);
  };

  const identifySuccessors = (current: { row: number; col: number }) => {
    const successors: { row: number; col: number }[] = [];
    
    // For simplicity, use cardinal directions only
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    for (const [dRow, dCol] of directions) {
      const jumpPoint = jump(current.row, current.col, dRow, dCol);
      if (jumpPoint) {
        successors.push(jumpPoint);
      }
    }

    return successors;
  };

  const startKey = `${start.row},${start.col}`;
  gScore.set(startKey, 0);
  pq.enqueue(start, heuristic(start, end));

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

    const successors = identifySuccessors(current);
    for (const successor of successors) {
      const successorKey = `${successor.row},${successor.col}`;
      if (visited.has(successorKey)) continue;

      const tentativeGScore = (gScore.get(currentKey) || 0) + heuristic(current, successor);
      
      if (!gScore.has(successorKey) || tentativeGScore < gScore.get(successorKey)!) {
        cameFrom.set(successorKey, current);
        gScore.set(successorKey, tentativeGScore);
        pq.enqueue(successor, tentativeGScore + heuristic(successor, end));
      }
    }
  }

  return { visitedOrder, path: [], found: false };
};

// Swarm Algorithm - Explores with weighted bias towards goal
export const swarm = (
  grid: string[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): PathfindingResult => {
  const gridSize = grid.length;
  const visited = new Set<string>();
  const visitedOrder: { row: number; col: number }[] = [];
  const gScore = new Map<string, number>();
  const cameFrom = new Map<string, { row: number; col: number }>();
  const pq = new PriorityQueue<{ row: number; col: number }>();

  const startKey = `${start.row},${start.col}`;
  gScore.set(startKey, 0);
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

      const distFromStart = (gScore.get(currentKey) || 0) + 1;
      const distToEnd = heuristic(neighbor, end);
      
      // Swarm uses a weighted combination with higher weight on heuristic
      const priority = distFromStart + distToEnd * 2;

      if (!gScore.has(neighborKey) || distFromStart < gScore.get(neighborKey)!) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, distFromStart);
        pq.enqueue(neighbor, priority);
      }
    }
  }

  return { visitedOrder, path: [], found: false };
};
