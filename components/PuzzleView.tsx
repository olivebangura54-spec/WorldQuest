"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface PuzzleViewProps {
  puzzle: {
    id: string;
    title: string;
    imageUrl: string;
    location: string;
    description: string;
  };
  onComplete: () => void;
}

interface Piece {
  id: number;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  isSnapped: boolean;
  zIndex: number;
}

export default function PuzzleView({ puzzle, onComplete }: PuzzleViewProps) {
  const [gridSize, setGridSize] = useState(4);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [draggingPieceId, setDraggingPieceId] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [maxZ, setMaxZ] = useState(100);
  const [imgError, setImgError] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(true);
  
  // Timer & Scoring State
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [penalty, setPenalty] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const GRID_CONFIG = useMemo(() => {
    const size = 400; 
    const pieceSize = size / gridSize;
    return {
      rows: gridSize,
      cols: gridSize,
      size,
      pieceSize,
      snapThreshold: pieceSize * 0.35,
    };
  }, [gridSize]);

  // Timer Logic
  useEffect(() => {
    if (isActive && !isSolved) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isSolved]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    const baseScore = gridSize * gridSize * 100;
    const timeBonus = Math.max(0, 2000 - seconds * 5);
    const finalScore = Math.max(100, baseScore + timeBonus - penalty);
    return Math.floor(finalScore);
  };

  const initializePuzzle = (size: number, isReset = false) => {
    const rows = size;
    const cols = size;
    const pieceSize = 400 / size;
    const newPieces: Piece[] = [];
    
    const scatterWidth = containerRef.current?.offsetWidth || 800;
    const scatterHeight = 500;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = r * cols + c;
        const correctX = c * pieceSize + 20;
        const correctY = r * pieceSize + 20;
        
        const currentX = Math.random() * (scatterWidth - pieceSize - 450) + 450;
        const currentY = Math.random() * (scatterHeight - pieceSize - 50) + 25;
        
        newPieces.push({
          id,
          correctX,
          correctY,
          currentX,
          currentY,
          isSnapped: false,
          zIndex: 1
        });
      }
    }
    setPieces(newPieces);
    setIsSolved(false);
    setMaxZ(100);
    setSeconds(0);
    setIsActive(false);
    if (isReset) setPenalty(p => p + 100);
  };

  useEffect(() => {
    setIsImgLoading(true);
    setImgError(false);
    initializePuzzle(gridSize);
  }, [puzzle.id, gridSize]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, piece: Piece) => {
    if (piece.isSnapped || isSolved || imgError || isImgLoading) return;
    
    if (!isActive) setIsActive(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggingPieceId(piece.id);
    setOffset({
      x: (clientX - rect.left) - piece.currentX,
      y: (clientY - rect.top) - piece.currentY
    });
    
    const newZ = maxZ + 1;
    setMaxZ(newZ);
    setPieces(prev => prev.map(p => p.id === piece.id ? { ...p, zIndex: newZ } : p));
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggingPieceId === null) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = (clientX - rect.left) - offset.x;
    const newY = (clientY - rect.top) - offset.y;
    
    setPieces(prev => prev.map(p => p.id === draggingPieceId ? { ...p, currentX: newX, currentY: newY } : p));
  };

  const handleMouseUp = () => {
    if (draggingPieceId === null) return;
    
    const piece = pieces.find(p => p.id === draggingPieceId);
    if (!piece) return;

    const distX = Math.abs(piece.currentX - piece.correctX);
    const distY = Math.abs(piece.currentY - piece.correctY);

    if (distX < GRID_CONFIG.snapThreshold && distY < GRID_CONFIG.snapThreshold) {
      const updatedPieces = pieces.map(p => 
        p.id === draggingPieceId 
          ? { ...p, currentX: p.correctX, currentY: p.correctY, isSnapped: true, zIndex: 0 } 
          : p
      );
      setPieces(updatedPieces);
      
      if (updatedPieces.every(p => p.isSnapped)) {
        setIsSolved(true);
        setIsActive(false);
        setScore(calculateScore());
      }
    }

    setDraggingPieceId(null);
  };

  const getClipPath = (id: number) => {
    const r = Math.floor(id / GRID_CONFIG.cols);
    const c = id % GRID_CONFIG.cols;
    const top = r === 0 ? 0 : (id % 2 === 0 ? 1 : -1);
    const bottom = r === GRID_CONFIG.rows - 1 ? 0 : ((id + GRID_CONFIG.cols) % 2 === 0 ? -1 : 1);
    const left = c === 0 ? 0 : (id % 2 === 0 ? -1 : 1);
    const right = c === GRID_CONFIG.cols - 1 ? 0 : ((id + 1) % 2 === 0 ? 1 : -1);

    let path = "polygon(";
    path += "0% 0%, ";
    if (top === 1) path += "35% 0%, 40% -10%, 50% -15%, 60% -10%, 65% 0%, ";
    if (top === -1) path += "35% 0%, 40% 10%, 50% 15%, 60% 10%, 65% 0%, ";
    path += "100% 0%, ";
    if (right === 1) path += "100% 35%, 110% 40%, 115% 50%, 110% 60%, 100% 65%, ";
    if (right === -1) path += "100% 35%, 90% 40%, 85% 50%, 90% 60%, 100% 65%, ";
    path += "100% 100%, ";
    if (bottom === 1) path += "65% 100%, 60% 110%, 50% 115%, 40% 110%, 35% 100%, ";
    if (bottom === -1) path += "65% 100%, 60% 90%, 50% 85%, 40% 90%, 35% 100%, ";
    path += "0% 100%, ";
    if (left === 1) path += "0% 65%, -10% 60%, -15% 50%, -10% 40%, 0% 35%, ";
    if (left === -1) path += "0% 65%, 10% 60%, 15% 50%, 10% 40%, 0% 35%, ";
    path += "0% 0%)";
    return path;
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Polished Game Header */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-6 mb-8 bg-gray-900/80 backdrop-blur-md p-6 rounded-3xl border border-gray-800 shadow-2xl">
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-white tracking-tight uppercase">{puzzle.title}</h2>
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{puzzle.location}</span>
            <span className="text-xs font-bold text-gray-500">{gridSize}x{gridSize} GRID</span>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Elapsed Time</span>
            <div className={`text-2xl font-mono font-bold ${isActive ? 'text-blue-400' : 'text-gray-400'} transition-colors`}>
              {formatTime(seconds)}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Live Score</span>
            <div className="text-2xl font-mono font-bold text-yellow-500">
              {isActive ? calculateScore() : "----"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
            {[4, 6, 10].map(size => (
              <button
                key={size}
                onClick={() => setGridSize(size)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  gridSize === size ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
                }`}
              >
                {size}x{size}
              </button>
            ))}
          </div>
          <button
            onClick={() => initializePuzzle(gridSize, true)}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl transition-all border border-gray-700 group active:scale-95"
            title="Reset Puzzle"
          >
            <span className="group-hover:rotate-180 transition-transform duration-500 inline-block">🔄</span>
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="w-full h-[600px] bg-gray-950/50 rounded-[2.5rem] border border-gray-800 relative shadow-inner overflow-hidden touch-none select-none transition-all duration-500"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {/* The Board Area */}
        <div 
          className="absolute bg-gray-900/40 rounded-2xl border-2 border-dashed border-gray-800 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]"
          style={{ width: GRID_CONFIG.size + 4, height: GRID_CONFIG.size + 4, left: 20, top: 20 }}
        >
          {imgError ? (
             <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold p-8 text-center">
               ⚠️ IMAGE FAILED TO LOAD.<br/>PLEASE CHECK YOUR CONNECTION.
             </div>
          ) : isImgLoading ? (
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
             </div>
          ) : !isSolved && Array.from({ length: gridSize * gridSize }).map((_, i) => (
            <div 
              key={i}
              className="absolute border border-gray-800/10"
              style={{
                width: GRID_CONFIG.pieceSize,
                height: GRID_CONFIG.pieceSize,
                left: (i % gridSize) * GRID_CONFIG.pieceSize,
                top: Math.floor(i / gridSize) * GRID_CONFIG.pieceSize,
              }}
            />
          ))}
        </div>

        {/* The Pieces with Animations */}
        {!imgError && !isImgLoading && pieces.map((piece) => {
          const r = Math.floor(piece.id / GRID_CONFIG.cols);
          const c = piece.id % GRID_CONFIG.cols;
          const isDragging = draggingPieceId === piece.id;
          
          return (
            <div
              key={piece.id}
              onMouseDown={(e) => handleMouseDown(e, piece)}
              onTouchStart={(e) => handleMouseDown(e, piece)}
              className={`absolute cursor-grab active:cursor-grabbing transition-all ${
                piece.isSnapped 
                  ? "cursor-default pointer-events-none animate-in zoom-in-105 duration-300" 
                  : "hover:brightness-110"
              } ${isDragging ? "shadow-2xl z-[9999] scale-110 !transition-none" : "duration-200 ease-out"}`}
              style={{
                width: GRID_CONFIG.pieceSize * 1.3,
                height: GRID_CONFIG.pieceSize * 1.3,
                left: piece.currentX,
                top: piece.currentY,
                zIndex: piece.zIndex,
                backgroundImage: `url(${puzzle.imageUrl})`,
                backgroundSize: `${GRID_CONFIG.size}px ${GRID_CONFIG.size}px`,
                backgroundPosition: `-${c * GRID_CONFIG.pieceSize}px -${r * GRID_CONFIG.pieceSize}px`,
                clipPath: getClipPath(piece.id),
                filter: piece.isSnapped ? "none" : `drop-shadow(0 ${isDragging ? '12px 24px' : '4px 8px'} rgba(0,0,0,0.6))`,
                backgroundRepeat: "no-repeat"
              }}
            />
          );
        })}

        {/* Hackathon Completion Modal */}
        {isSolved && (
          <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-gray-950/80 backdrop-blur-md animate-in fade-in duration-700">
            <div className="bg-gray-900 border-2 border-blue-500/50 p-12 rounded-[3rem] shadow-[0_0_100px_rgba(59,130,246,0.2)] text-center animate-in zoom-in duration-500 max-w-sm w-full">
              <div className="text-8xl mb-8 animate-bounce">💎</div>
              <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Quest Cleared</h2>
              <p className="text-blue-400 font-bold mb-10 tracking-widest text-xs uppercase">Knowledge Crystal Restored</p>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-gray-800/50 p-4 rounded-3xl border border-gray-700">
                  <div className="text-[10px] font-black text-gray-500 uppercase mb-1">Time</div>
                  <div className="text-xl font-mono font-bold text-white">{formatTime(seconds)}</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-3xl border border-gray-700">
                  <div className="text-[10px] font-black text-gray-500 uppercase mb-1">Score</div>
                  <div className="text-xl font-mono font-bold text-yellow-500">{score}</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={onComplete}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-900/40"
                >
                  Collect Rewards
                </button>
                <button
                  onClick={() => initializePuzzle(gridSize)}
                  className="w-full py-3 text-gray-400 hover:text-white font-bold transition-all text-sm"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2 text-gray-500">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          <p className="text-xs font-bold uppercase tracking-widest">Target: {puzzle.description}</p>
        </div>
        <div className="bg-gray-900 px-6 py-2 rounded-full border border-gray-800 shadow-xl flex items-center space-x-4">
          <div className="h-1.5 w-32 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(pieces.filter(p => p.isSnapped).length / (gridSize * gridSize)) * 100}%` }}
            ></div>
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase">
            {pieces.filter(p => p.isSnapped).length} / {gridSize * gridSize} Pieces Aligned
          </span>
        </div>
      </div>
      
      {/* Preload and error check */}
      <img 
        src={puzzle.imageUrl} 
        alt="" 
        className="hidden" 
        onLoad={() => setIsImgLoading(false)}
        onError={() => {
          setIsImgLoading(false);
          setImgError(true);
        }}
      />
    </div>
  );
}
