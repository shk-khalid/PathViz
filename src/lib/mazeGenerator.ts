export const generateMaze = (gridSize: number): string[][] => {
  const grid: string[][] = Array(gridSize).fill(null).map(() => 
    Array(gridSize).fill('wall')
  );

  const stack: { row: number; col: number }[] = [];
  const startRow = 1;
  const startCol = 1;
  
  grid[startRow][startCol] = 'empty';
  stack.push({ row: startRow, col: startCol });

  const directions = [
    [-2, 0], [2, 0], [0, -2], [0, 2]
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors: { row: number; col: number; wallRow: number; wallCol: number }[] = [];

    for (const [dr, dc] of directions) {
      const newRow = current.row + dr;
      const newCol = current.col + dc;
      const wallRow = current.row + dr / 2;
      const wallCol = current.col + dc / 2;

      if (
        newRow > 0 && newRow < gridSize - 1 &&
        newCol > 0 && newCol < gridSize - 1 &&
        grid[newRow][newCol] === 'wall'
      ) {
        neighbors.push({ row: newRow, col: newCol, wallRow, wallCol });
      }
    }

    if (neighbors.length > 0) {
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      grid[randomNeighbor.row][randomNeighbor.col] = 'empty';
      grid[randomNeighbor.wallRow][randomNeighbor.wallCol] = 'empty';
      stack.push({ row: randomNeighbor.row, col: randomNeighbor.col });
    } else {
      stack.pop();
    }
  }

  return grid;
};
