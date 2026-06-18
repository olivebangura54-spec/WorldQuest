"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   PUZZLE VIEW — Jigsaw puzzle with SVG tab/blank pieces
   ═══════════════════════════════════════════════════════════════ */

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

type EdgeDir = 1 | -1;

interface PuzzlePiece {
  id: number;
  row: number;
  col: number;
  x: number;
  y: number;
  snapped: boolean;
  edges: { top: EdgeDir; right: EdgeDir; bottom: EdgeDir; left: EdgeDir };
  zIndex: number;
}

const GRID = 4;
const CELL = 90;
const BOARD_SIZE = GRID * CELL;
const TAB = 14;
const TOTAL = BOARD_SIZE + TAB * 2;
const SNAP_DIST = CELL * 0.55;

/* ─── Generate jigsaw SVG path ─── */
function jigsawPath(e: PuzzlePiece["edges"]): string {
  const H = 100;
  const T = 14;
  const A = 0.55;
  let p = `M 0,0 `;
  // top edge
  p += `L ${H * 0.35},0 C ${H * (0.35 + A * 0.15)},${e.top * -T} ${H * (0.65 - A * 0.15)},${e.top * -T} ${H * 0.65},0 `;
  // right edge
  p += `L ${H},${H * 0.35} C ${H + e.right * T},${H * (0.35 - A * 0.15)} ${H + e.right * T},${H * (0.65 + A * 0.15)} ${H},${H * 0.65} `;
  // bottom edge
  p += `L ${H * 0.65},${H} C ${H * (0.65 - A * 0.15)},${H + e.bottom * T} ${H * (0.35 + A * 0.15)},${H + e.bottom * T} ${H * 0.35},${H} `;
  // left edge
  p += `L 0,${H * 0.65} C ${e.left * T},${H * (0.65 + A * 0.15)} ${e.left * T},${H * (0.35 - A * 0.15)} 0,${H * 0.35} Z`;
  return p;
}

/* ─── Generate all pieces ─── */
function generatePieces(): PuzzlePiece[] {
  const edges: PuzzlePiece["edges"][][] = Array.from({ length: GRID }, () =>
    Array.from({ length: GRID }, () => ({
      top: 1 as EdgeDir,
      right: 1 as EdgeDir,
      bottom: 1 as EdgeDir,
      left: 1 as EdgeDir,
    }))
  );

  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (c < GRID - 1) {
        const d = (Math.random() > 0.5 ? 1 : -1) as EdgeDir;
        edges[r][c].right = d;
        edges[r][c + 1].left = (-d as -1 | 1);
      }
      if (r < GRID - 1) {
        const d = (Math.random() > 0.5 ? 1 : -1) as EdgeDir;
        edges[r][c].bottom = d;
        edges[r + 1][c].top = (-d as -1 | 1);
      }
    }
  }

  const pieces: PuzzlePiece[] = [];
  const pad = TAB * 1.5;
  const areaW = 600;
  const areaH = 250;

  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const id = r * GRID + c;
      pieces.push({
        id,
        row: r,
        col: c,
        x: pad + Math.random() * (areaW - pad * 2),
        y: pad + Math.random() * (areaH - pad * 2),
        snapped: false,
        edges: edges[r][c],
        zIndex: id + 1,
      });
    }
  }
  return pieces;
}

export default function PuzzleView({ puzzle, onComplete }: PuzzleViewProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>(() => generatePieces());
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [active, setActive] = useState(false);
  const [maxZ, setMaxZ] = useState(GRID * GRID + 10);
  const [showHint, setShowHint] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const trayRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const placed = useMemo(
    () => pieces.reduce((n, p) => n + (p.snapped ? 1 : 0), 0),
    [pieces]
  );

  // Timer
  useEffect(() => {
    if (!active || solved) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [active, solved]);

  // Solved check
  useEffect(() => {
    if (placed === GRID * GRID && !solved) {
      setSolved(true);
      setActive(false);
    }
  }, [placed, solved]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  /* ─── Interactions ─── */
  const selectPiece = useCallback(
    (id: number) => {
      if (solved) return;
      if (!active) setActive(true);
      setMaxZ((prev) => {
        const next = prev + 1;
        setPieces((ps) =>
          ps.map((p) => (p.id === id ? { ...p, zIndex: next } : p))
        );
        return next;
      });
      setSelected(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [solved, active]
  );

  const placePiece = useCallback(
    (row: number, col: number) => {
      if (selected === null || solved) return;
      setPieces((ps) => {
        const piece = ps.find((p) => p.id === selected);
        if (!piece || piece.row !== row || piece.col !== col) return ps;
        return ps.map((p) =>
          p.id === selected
            ? { ...p, snapped: true, x: col * CELL, y: row * CELL }
            : p
        );
      });
      setSelected(null);
    },
    [selected, solved]
  );

  const restart = useCallback(() => {
    setPieces(generatePieces());
    setSelected(null);
    setSolved(false);
    setElapsed(0);
    setActive(false);
    setShowHint(false);
  }, []);

  const trayZIndex = (p: PuzzlePiece) => {
    if (p.snapped) return 0;
    if (p.id === selected) return maxZ + 100;
    return p.zIndex;
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex gap-0 select-none" style={{ userSelect: "none" }}>
      {/* ═══ SIDEBAR ═══ */}
      <div
        className="hidden sm:flex flex-col items-center gap-3 py-4 px-2 shrink-0"
        style={{
          background: "rgba(15,15,25,0.95)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "1.5rem 0 0 1.5rem",
        }}
      >
        {/* Hint */}
        <button
          onClick={() => {
            setShowHint(true);
            setTimeout(() => setShowHint(false), 2500);
          }}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.25)",
          }}
          title="Hint"
        >
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Restart */}
        <button
          onClick={restart}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 group"
          style={{
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.25)",
          }}
          title="Restart"
        >
          <svg className="w-5 h-5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
        </button>

        {/* Home */}
        <button
          onClick={onComplete}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "rgba(168,85,247,0.1)",
            border: "1px solid rgba(168,85,247,0.25)",
          }}
          title="Back"
        >
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </button>

        {/* Help */}
        <button
          onClick={() => setShowHelp(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "rgba(34,211,238,0.1)",
            border: "1px solid rgba(34,211,238,0.25)",
          }}
          title="How to play"
        >
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </button>
      </div>

      {/* ═══ MAIN AREA ═══ */}
      <div className="flex-1 min-w-0 p-4 sm:p-6" style={{ background: "rgba(10,10,20,0.9)" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white/90 truncate">{puzzle.title}</h3>
            <p className="text-[10px] text-white/30">{puzzle.location}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-white/40">
              {fmt(elapsed)}
            </span>
            <span className="text-[10px] font-bold text-blue-400">
              {placed}/{GRID * GRID}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(placed / (GRID * GRID)) * 100}%`,
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
            }}
          />
        </div>

        {/* ─── PIECES TRAY ─── */}
        <div
          ref={trayRef}
          className="relative rounded-2xl mb-4 overflow-hidden"
          style={{
            height: 270,
            background: "rgba(20,18,30,0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] text-white/10 font-medium tracking-wider uppercase">
              {placed < GRID * GRID ? "Scattered pieces — click to select, then click board below" : ""}
            </span>
          </div>

          {pieces
            .filter((p) => !p.snapped)
            .map((piece) => {
              const isSelected = selected === piece.id;
              return (
                <div
                  key={piece.id}
                  className="absolute cursor-pointer transition-transform"
                  style={{
                    left: piece.x,
                    top: piece.y,
                    zIndex: trayZIndex(piece),
                    filter: isSelected
                      ? "drop-shadow(0 0 14px rgba(168,85,247,0.8)) brightness(1.15)"
                      : "drop-shadow(0 2px 6px rgba(0,0,0,0.7))",
                    transform: isSelected ? "scale(1.08)" : undefined,
                    transition: "filter 0.15s, transform 0.15s",
                  }}
                  onClick={() => selectPiece(piece.id)}
                >
                  <svg
                    viewBox="-16 -16 132 132"
                    width={CELL + TAB * 2}
                    height={CELL + TAB * 2}
                    className="pointer-events-auto"
                  >
                    <defs>
                      <clipPath id={`tray-clip-${piece.id}`}>
                        <path d={jigsawPath(piece.edges)} />
                      </clipPath>
                    </defs>
                    <g clipPath={`url(#tray-clip-${piece.id})`}>
                      <image
                        href={puzzle.imageUrl}
                        x={-piece.col * 100}
                        y={-piece.row * 100}
                        width={GRID * 100}
                        height={GRID * 100}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </g>
                    <path
                      d={jigsawPath(piece.edges)}
                      fill="none"
                      stroke={isSelected ? "rgba(168,85,247,0.9)" : "rgba(255,255,255,0.2)"}
                      strokeWidth={isSelected ? 1.5 : 0.7}
                    />
                  </svg>
                </div>
              );
            })}
        </div>

        {/* ─── PUZZLE BOARD ─── */}
        <div
          ref={boardRef}
          className="relative rounded-2xl mx-auto"
          style={{
            width: BOARD_SIZE + TAB * 2,
            height: BOARD_SIZE + TAB * 2,
            background: "rgba(15,12,25,0.7)",
            border: "2px dashed rgba(255,255,255,0.08)",
            borderRadius: "1.5rem",
          }}
        >
          {/* Grid silhouette */}
          <svg
            viewBox={`-${TAB} -${TAB} ${BOARD_SIZE + TAB * 2} ${BOARD_SIZE + TAB * 2}`}
            width={BOARD_SIZE + TAB * 2}
            height={BOARD_SIZE + TAB * 2}
            className="absolute inset-0"
          >
            {Array.from({ length: GRID * GRID }).map((_, i) => {
              const r = Math.floor(i / GRID);
              const c = i % GRID;
              return (
                <rect
                  key={i}
                  x={c * CELL + 2}
                  y={r * CELL + 2}
                  width={CELL - 4}
                  height={CELL - 4}
                  rx={3}
                  fill="rgba(255,255,255,0.015)"
                  stroke="rgba(255,255,255,0.035)"
                  strokeWidth={0.5}
                />
              );
            })}
          </svg>

          {/* Placed pieces */}
          {pieces
            .filter((p) => p.snapped)
            .map((piece) => (
              <div
                key={piece.id}
                className="absolute"
                style={{
                  left: piece.x + TAB,
                  top: piece.y + TAB,
                  zIndex: 1,
                  animation: "snap-in 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                <svg viewBox="-16 -16 132 132" width={CELL + TAB * 2} height={CELL + TAB * 2}>
                  <defs>
                    <clipPath id={`board-clip-${piece.id}`}>
                      <path d={jigsawPath(piece.edges)} />
                    </clipPath>
                  </defs>
                  <g clipPath={`url(#board-clip-${piece.id})`}>
                    <image
                      href={puzzle.imageUrl}
                      x={-piece.col * 100}
                      y={-piece.row * 100}
                      width={GRID * 100}
                      height={GRID * 100}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </g>
                  <path
                    d={jigsawPath(piece.edges)}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={0.5}
                  />
                </svg>
              </div>
            ))}

          {/* Click targets for placing pieces */}
          {selected !== null && !solved && (
            <>
              {Array.from({ length: GRID * GRID }).map((_, i) => {
                const r = Math.floor(i / GRID);
                const c = i % GRID;
                const occupied = pieces.some(
                  (p) => p.snapped && p.row === r && p.col === c
                );
                if (occupied) return null;
                return (
                  <button
                    key={i}
                    className="absolute rounded-lg transition-all hover:bg-blue-500/15 hover:border-blue-400/40"
                    style={{
                      left: c * CELL + TAB,
                      top: r * CELL + TAB,
                      width: CELL,
                      height: CELL,
                      border: "1px solid rgba(59,130,246,0.15)",
                      background: "rgba(59,130,246,0.03)",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                    onClick={() => placePiece(r, c)}
                  />
                );
              })}
            </>
          )}
        </div>

        {/* Mobile sidebar actions */}
        <div className="flex sm:hidden justify-center gap-3 mt-4">
          <button
            onClick={() => { setShowHint(true); setTimeout(() => setShowHint(false), 2500); }}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)" }}
          >
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button onClick={restart} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)" }}>
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
          </button>
          <button onClick={onComplete} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </button>
          <button onClick={() => setShowHelp(true)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)" }}>
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ═══ HINT OVERLAY ═══ */}
      {showHint && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowHint(false)}
          style={{ animation: "fade-in 0.3s ease-out" }}
        >
          <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              border: "2px solid rgba(59,130,246,0.4)",
              boxShadow: "0 0 60px rgba(59,130,246,0.2)",
              maxWidth: "85vw",
              maxHeight: "70vh",
            }}
          >
            <img
              src={puzzle.imageUrl}
              alt="Hint"
              className="w-full h-full object-contain"
              style={{ maxWidth: 400, maxHeight: 400 }}
            />
          </div>
        </div>
      )}

      {/* ═══ HELP MODAL ═══ */}
      {showHelp && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowHelp(false)}
          style={{ animation: "fade-in 0.3s ease-out" }}
        >
          <div
            className="rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(20,18,30,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 0 60px rgba(168,85,247,0.15)",
            }}
          >
            <h3 className="text-lg font-bold text-white mb-4">How to Play</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">1.</span>
                <span>Click a scattered piece in the tray to select it (it glows purple)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">2.</span>
                <span>Click an empty cell on the board below to place it</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">3.</span>
                <span>Correct placement snaps the piece in place with a bounce</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">4.</span>
                <span>Wrong placement — the piece stays in the tray, try another cell</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">5.</span>
                <span>Use the eye icon to peek at the reference image</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">6.</span>
                <span>Complete the full image to unlock your reward!</span>
              </li>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #9333ea, #06b6d4)" }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* ═══ SOLVED OVERLAY ═══ */}
      {solved && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md"
          style={{ animation: "fade-in 0.5s ease-out" }}
        >
          <div
            className="rounded-3xl p-10 text-center max-w-sm w-full mx-4 relative overflow-hidden"
            style={{
              background: "rgba(20,18,30,0.98)",
              border: "2px solid rgba(168,85,247,0.4)",
              boxShadow: "0 0 80px rgba(168,85,247,0.25), 0 0 160px rgba(34,211,238,0.1)",
              animation: "scale-in 0.6s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {/* Confetti particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: -10,
                  background: ["#a855f7", "#06b6d4", "#fbbf24", "#f43f5e", "#4ade80"][i % 5],
                  animation: `confetti-fall ${1.5 + Math.random() * 2}s ${Math.random() * 0.5}s ease-in forwards`,
                }}
              />
            ))}

            <div
              className="text-6xl mb-4"
              style={{ animation: "scale-in 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }}
            >
              💎
            </div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">
              Puzzle Complete!
            </h2>
            <p className="text-purple-400 font-bold text-xs tracking-widest uppercase mb-6">
              Knowledge Crystal Restored
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-[10px] font-bold text-white/30 uppercase">Time</div>
                <div className="text-lg font-mono font-bold text-white">{fmt(elapsed)}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-[10px] font-bold text-white/30 uppercase">Pieces</div>
                <div className="text-lg font-mono font-bold text-blue-400">{GRID * GRID}</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={onComplete}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm"
                style={{
                  background: "linear-gradient(135deg, #9333ea, #06b6d4)",
                  boxShadow: "0 0 24px rgba(147,51,234,0.3)",
                }}
              >
                Collect Rewards
              </button>
              <button
                onClick={restart}
                className="w-full py-2 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STYLES ═══ */}
      <style jsx>{`
        @keyframes snap-in {
          0% { transform: scale(1.15); opacity: 0.6; }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}