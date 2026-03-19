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
    <div className="w-[360px] h-screen bg-gray-950/80 backdrop-blur-xl border-r border-white/10 p-6 overflow-hidden flex flex-col gap-6 shadow-2xl">
      <div className="flex items-center gap-3">
        <img src="/favicon.svg" alt="PathViz Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-blue-500/20" />
        <div className="space-y-0.5">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight leading-none">
            PathViz
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-none">
            Visualizer
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Algorithm Selection */}
        <div className="space-y-1.5">
          <Label className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Algorithm</Label>
          <Select value={algorithm} onValueChange={(value) => onAlgorithmChange(value as AlgorithmType)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-blue-500 hover:bg-white/10 hover:text-white transition-colors h-10 px-4">
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
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Grid Size</Label>
            <span className="text-[10px] font-bold text-blue-400 tracking-wider font-mono">{gridSize}x{gridSize}</span>
          </div>
          <Slider
            value={[gridSize]}
            onValueChange={(value) => onGridSizeChange(value[0])}
            min={10}
            max={50}
            step={5}
            showTicks={true}
            className="w-full h-4"
            disabled={isVisualizing}
          />
        </div>

        {/* Animation Speed */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Animation Speed</Label>
            <span className="text-[10px] font-bold text-blue-400 tracking-wider font-mono">{speed}ms</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={1}
            max={100}
            step={1}
            className="w-full h-4"
          />
        </div>

        {/* Draw Mode */}
        <div className="space-y-2">
          <Label className="text-white text-sm font-medium">Draw Mode</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              className={`h-11 border border-white/10 transition-all ${drawMode === 'wall' ? 'bg-blue-600 text-white hover:bg-blue-500 hover:text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
              onClick={() => onDrawModeChange(drawMode === 'wall' ? null : 'wall')}
              disabled={isVisualizing}
            >
              <Square className="w-4 h-4 mr-2" />
              Wall
            </Button>
            <Button
              variant="ghost"
              className={`h-11 border border-white/10 transition-all ${drawMode === 'start' ? 'bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
              onClick={() => onDrawModeChange(drawMode === 'start' ? null : 'start')}
              disabled={isVisualizing}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Start
            </Button>
            <Button
              variant="ghost"
              className={`h-11 border border-white/10 transition-all ${drawMode === 'end' ? 'bg-rose-600 text-white hover:bg-rose-500 hover:text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
              onClick={() => onDrawModeChange(drawMode === 'end' ? null : 'end')}
              disabled={isVisualizing}
            >
              <Flag className="w-4 h-4 mr-2" />
              End
            </Button>
            <Button
              variant="ghost"
              className="h-11 bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
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
            className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all border-0"
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
                Proceed
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full h-11 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white active:scale-[0.98] transition-all"
            onClick={onClearPath}
            disabled={isVisualizing}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear Path
          </Button>
          <Button
            variant="ghost"
            className="w-full h-11 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-gray-400 hover:text-rose-500 active:scale-[0.98] transition-all group"
            onClick={onClearBoard}
            disabled={isVisualizing}
          >
            <Trash2 className="w-4 h-4 mr-2 transition-colors" />
            Clear Board
          </Button>
        </div>

        {/* Legend */}
        <div className="space-y-3 pt-5 border-t border-white/5">
          <Label className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Legend</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: 'Start', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/40' },
              { label: 'End', color: 'bg-rose-500', shadow: 'shadow-rose-500/40' },
              { label: 'Wall', color: 'bg-blue-600', shadow: 'shadow-blue-600/40' },
              { label: 'Visited', color: 'bg-blue-300', shadow: 'shadow-blue-300/40' },
              { label: 'Path', color: 'bg-yellow-400', shadow: 'shadow-yellow-400/40' },
            ].map((item, index) => (
              <div 
                key={item.label}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all group ${index === 4 ? 'col-span-2' : ''}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${item.color} shadow-[0_0_6px] ${item.shadow}`}></div>
                <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300 uppercase tracking-widest leading-none transition-colors">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
