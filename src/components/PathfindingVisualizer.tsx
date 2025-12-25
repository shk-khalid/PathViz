import { useState, useCallback } from 'react';
import Grid from './Grid';
import ControlPanel from './ControlPanel';
import { CellType, DrawMode, AlgorithmType } from '@/types/pathfinding';
import { dijkstra, astar, bfs, dfs } from '@/lib/algorithms';
import { generateMaze } from '@/lib/mazeGenerator';
import { useToast } from '@/components/ui/use-toast';

export default function PathfindingVisualizer() {
  const [gridSize, setGridSize] = useState(25);
  const [cells, setCells] = useState<CellType[][]>(() =>
    Array(25).fill(null).map(() => Array(25).fill('empty'))
  );
  const [startPoint, setStartPoint] = useState<{ row: number; col: number } | null>(null);
  const [endPoint, setEndPoint] = useState<{ row: number; col: number } | null>(null);
  const [drawMode, setDrawMode] = useState<DrawMode>(null);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('dijkstra');
  const [speed, setSpeed] = useState(20);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const { toast } = useToast();

  const handleGridSizeChange = useCallback((newSize: number) => {
    setGridSize(newSize);
    setCells(Array(newSize).fill(null).map(() => Array(newSize).fill('empty')));
    setStartPoint(null);
    setEndPoint(null);
  }, []);

  const handleCellUpdate = useCallback((row: number, col: number, type: CellType) => {
    setCells(prev => {
      const newCells = prev.map(r => [...r]);

      if (type === 'start') {
        // Remove old start point
        if (startPoint) {
          newCells[startPoint.row][startPoint.col] = 'empty';
        }
        newCells[row][col] = 'start';
        setStartPoint({ row, col });
      } else if (type === 'end') {
        // Remove old end point
        if (endPoint) {
          newCells[endPoint.row][endPoint.col] = 'empty';
        }
        newCells[row][col] = 'end';
        setEndPoint({ row, col });
      } else {
        // Handle wall toggle
        if (newCells[row][col] === 'start') {
          setStartPoint(null);
        } else if (newCells[row][col] === 'end') {
          setEndPoint(null);
        }
        newCells[row][col] = type;
      }

      return newCells;
    });
  }, [startPoint, endPoint]);

  const clearPath = useCallback(() => {
    setCells(prev => prev.map(row =>
      row.map(cell => (cell === 'visited' || cell === 'path' ? 'empty' : cell))
    ));
  }, []);

  const clearBoard = useCallback(() => {
    setCells(Array(gridSize).fill(null).map(() => Array(gridSize).fill('empty')));
    setStartPoint(null);
    setEndPoint(null);
  }, [gridSize]);

  const handleGenerateMaze = useCallback(() => {
    const maze = generateMaze(gridSize);
    setCells(maze as CellType[][]);
    setStartPoint(null);
    setEndPoint(null);
  }, [gridSize]);

  const visualize = useCallback(async () => {
    if (!startPoint || !endPoint) {
      toast({
        title: "Error",
        description: "Please set both start and end points",
        variant: "destructive"
      });
      return;
    }

    clearPath();
    setIsVisualizing(true);

    // Convert cells to string format for algorithms
    const gridForAlgo = cells.map(row =>
      row.map(cell => (cell === 'wall' ? 'wall' : 'empty'))
    );

    let result;
    switch (algorithm) {
      case 'dijkstra':
        result = dijkstra(gridForAlgo, startPoint, endPoint);
        break;
      case 'astar':
        result = astar(gridForAlgo, startPoint, endPoint);
        break;
      case 'bfs':
        result = bfs(gridForAlgo, startPoint, endPoint);
        break;
      case 'dfs':
        result = dfs(gridForAlgo, startPoint, endPoint);
        break;
    }

    // Animate visited cells
    for (let i = 0; i < result.visitedOrder.length; i++) {
      await new Promise(resolve => setTimeout(resolve, speed));
      const { row, col } = result.visitedOrder[i];
      if (cells[row][col] !== 'start' && cells[row][col] !== 'end') {
        setCells(prev => {
          const newCells = prev.map(r => [...r]);
          newCells[row][col] = 'visited';
          return newCells;
        });
      }
    }

    // Animate path
    if (result.found) {
      for (let i = 1; i < result.path.length - 1; i++) {
        await new Promise(resolve => setTimeout(resolve, speed * 2));
        const { row, col } = result.path[i];
        setCells(prev => {
          const newCells = prev.map(r => [...r]);
          newCells[row][col] = 'path';
          return newCells;
        });
      }
      toast({
        title: "Path Found!",
        description: `Path length: ${result.path.length} cells`,
      });
    } else {
      toast({
        title: "No Path Found",
        description: "There is no path between start and end points",
        variant: "destructive"
      });
    }

    setIsVisualizing(false);
  }, [cells, startPoint, endPoint, algorithm, speed, toast, clearPath]);

  return (
    <div className="flex h-screen bg-gray-950">
      <ControlPanel
        gridSize={gridSize}
        onGridSizeChange={handleGridSizeChange}
        algorithm={algorithm}
        onAlgorithmChange={setAlgorithm}
        speed={speed}
        onSpeedChange={setSpeed}
        drawMode={drawMode}
        onDrawModeChange={setDrawMode}
        onVisualize={visualize}
        onClearPath={clearPath}
        onClearBoard={clearBoard}
        onGenerateMaze={handleGenerateMaze}
        isVisualizing={isVisualizing}
      />
      <div className="flex-1 flex items-center justify-center overflow-auto">
        <Grid
          gridSize={gridSize}
          cells={cells}
          drawMode={drawMode}
          onCellUpdate={handleCellUpdate}
          startPoint={startPoint}
          endPoint={endPoint}
        />
      </div>
    </div>
  );
}
