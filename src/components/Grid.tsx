import { useState, useRef, useCallback } from 'react';
import { CellType, DrawMode } from '@/types/pathfinding';

interface GridCellProps {
  type: CellType;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  size: number;
}

const GridCell = ({ type, onMouseDown, onMouseEnter, size }: GridCellProps) => {
  const getCellColor = () => {
    switch (type) {
      case 'start':
        return 'bg-green-500';
      case 'end':
        return 'bg-red-500';
      case 'wall':
        return 'bg-gray-800';
      case 'visited':
        return 'bg-blue-300';
      case 'path':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-900 border border-gray-700';
    }
  };

  return (
    <div
      className={`${getCellColor()} transition-colors duration-100 cursor-pointer`}
      style={{ width: size, height: size }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    />
  );
};

interface GridProps {
  gridSize: number;
  cells: CellType[][];
  drawMode: DrawMode;
  onCellUpdate: (row: number, col: number, type: CellType) => void;
  startPoint: { row: number; col: number } | null;
  endPoint: { row: number; col: number } | null;
}

export default function Grid({
  gridSize,
  cells,
  drawMode,
  onCellUpdate,
  startPoint,
  endPoint
}: GridProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const cellSize = Math.min(Math.floor(800 / gridSize), 40);

  const handleMouseDown = useCallback((row: number, col: number) => {
    setIsDrawing(true);
    handleCellClick(row, col);
  }, [drawMode, cells, startPoint, endPoint]);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (isDrawing) {
      handleCellClick(row, col);
    }
  }, [isDrawing, drawMode, cells, startPoint, endPoint]);

  const handleCellClick = (row: number, col: number) => {
    const currentCell = cells[row][col];

    if (drawMode === 'wall') {
      if (currentCell === 'empty' || currentCell === 'visited' || currentCell === 'path') {
        onCellUpdate(row, col, 'wall');
      } else if (currentCell === 'wall') {
        onCellUpdate(row, col, 'empty');
      }
    } else if (drawMode === 'start') {
      if (currentCell !== 'end') {
        onCellUpdate(row, col, 'start');
      }
    } else if (drawMode === 'end') {
      if (currentCell !== 'start') {
        onCellUpdate(row, col, 'end');
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div
      ref={gridRef}
      className="inline-grid gap-0 select-none bg-gray-950 p-4 rounded-lg"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <GridCell
            key={`${rowIndex}-${colIndex}`}
            type={cell}
            size={cellSize}
            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}
