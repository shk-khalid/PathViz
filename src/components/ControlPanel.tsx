import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { AlgorithmType, DrawMode } from '@/types/pathfinding';
import { Play, Pause, RotateCcw, Trash2, Grid3x3, MapPin, Flag, Square } from 'lucide-react';

interface ControlPanelProps {
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  algorithm: AlgorithmType;
  onAlgorithmChange: (algo: AlgorithmType) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  drawMode: DrawMode;
  onDrawModeChange: (mode: DrawMode) => void;
  onVisualize: () => void;
  onClearPath: () => void;
  onClearBoard: () => void;
  onGenerateMaze: () => void;
  isVisualizing: boolean;
}

export default function ControlPanel({
  gridSize,
  onGridSizeChange,
  algorithm,
  onAlgorithmChange,
  speed,
  onSpeedChange,
  drawMode,
  onDrawModeChange,
  onVisualize,
  onClearPath,
  onClearBoard,
  onGenerateMaze,
  isVisualizing
}: ControlPanelProps) {
  return (
    <div className="w-[360px] h-screen bg-gray-900 border-r border-gray-800 p-6 overflow-y-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Pathfinding Visualizer</h1>
        <p className="text-sm text-gray-400">Visualize algorithms in action</p>
      </div>

      <div className="space-y-6">
        {/* Algorithm Selection */}
        <div className="space-y-2">
          <Label className="text-white text-sm font-medium">Algorithm</Label>
          <Select value={algorithm} onValueChange={(value) => onAlgorithmChange(value as AlgorithmType)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="dijkstra" className="text-white">Dijkstra's Algorithm</SelectItem>
              <SelectItem value="astar" className="text-white">A* Algorithm</SelectItem>
              <SelectItem value="bfs" className="text-white">Breadth-First Search</SelectItem>
              <SelectItem value="dfs" className="text-white">Depth-First Search</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid Size */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-white text-sm font-medium">Grid Size</Label>
            <span className="text-sm text-gray-400">{gridSize}x{gridSize}</span>
          </div>
          <Slider
            value={[gridSize]}
            onValueChange={(value) => onGridSizeChange(value[0])}
            min={10}
            max={50}
            step={5}
            className="w-full"
            disabled={isVisualizing}
          />
        </div>

        {/* Animation Speed */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-white text-sm font-medium">Animation Speed</Label>
            <span className="text-sm text-gray-400">{speed}ms</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Draw Mode */}
        <div className="space-y-2">
          <Label className="text-white text-sm font-medium">Draw Mode</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={drawMode === 'wall' ? 'default' : 'outline'}
              className={`${drawMode === 'wall' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'} border-gray-700 text-white`}
              onClick={() => onDrawModeChange(drawMode === 'wall' ? null : 'wall')}
              disabled={isVisualizing}
            >
              <Square className="w-4 h-4 mr-2" />
              Wall
            </Button>
            <Button
              variant={drawMode === 'start' ? 'default' : 'outline'}
              className={`${drawMode === 'start' ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-800 hover:bg-gray-700'} border-gray-700 text-white`}
              onClick={() => onDrawModeChange(drawMode === 'start' ? null : 'start')}
              disabled={isVisualizing}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Start
            </Button>
            <Button
              variant={drawMode === 'end' ? 'default' : 'outline'}
              className={`${drawMode === 'end' ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-800 hover:bg-gray-700'} border-gray-700 text-white`}
              onClick={() => onDrawModeChange(drawMode === 'end' ? null : 'end')}
              disabled={isVisualizing}
            >
              <Flag className="w-4 h-4 mr-2" />
              End
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
              onClick={onGenerateMaze}
              disabled={isVisualizing}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Maze
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-500 text-white"
            onClick={onVisualize}
            disabled={isVisualizing}
          >
            {isVisualizing ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Visualizing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Visualization
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
            onClick={onClearPath}
            disabled={isVisualizing}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear Path
          </Button>
          <Button
            variant="outline"
            className="w-full bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
            onClick={onClearBoard}
            disabled={isVisualizing}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Board
          </Button>
        </div>

        {/* Legend */}
        <div className="space-y-2 pt-4 border-t border-gray-800">
          <Label className="text-white text-sm font-medium">Legend</Label>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-300">Start Point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-300">End Point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-800 rounded"></div>
              <span className="text-gray-300">Wall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-300 rounded"></div>
              <span className="text-gray-300">Visited Cell</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-gray-300">Final Path</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
