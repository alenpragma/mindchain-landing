import React, { useMemo } from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

/**
 * Deterministic visual QR pattern generator in pure SVG with finder patterns
 */
export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 180 }) => {
  // Generate a deterministic 21x21 matrix from the input string
  const matrix = useMemo(() => {
    const gridSize = 21;
    const grid: boolean[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => false)
    );

    // Standard QR finder pattern generator
    const setFinder = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            grid[startY + r][startX + c] = true;
          }
        }
      }
    };

    setFinder(0, 0); // Top-left
    setFinder(gridSize - 7, 0); // Top-right
    setFinder(0, gridSize - 7); // Bottom-left

    // Timing patterns
    for (let i = 8; i < gridSize - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Hash the input string to fill deterministic data modules
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    let seed = Math.abs(hash) || 123456789;
    const nextRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip finder areas and center badge area
        const inFinderTL = r < 8 && c < 8;
        const inFinderTR = r < 8 && c >= gridSize - 8;
        const inFinderBL = r >= gridSize - 8 && c < 8;
        const inCenter = r >= 8 && r <= 12 && c >= 8 && c <= 12;

        if (!inFinderTL && !inFinderTR && !inFinderBL && !inCenter) {
          grid[r][c] = nextRandom() > 0.48;
        }
      }
    }

    return grid;
  }, [value]);

  const moduleSize = size / 21;

  return (
    <div className="relative inline-flex items-center justify-center p-3.5 bg-white rounded-xl shadow-lg border border-slate-700/50">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shape-rendering-crispEdges block"
      >
        <rect width={size} height={size} fill="#ffffff" rx="4" />
        {matrix.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * moduleSize}
                y={r * moduleSize}
                width={moduleSize}
                height={moduleSize}
                fill="#0f172a"
              />
            );
          })
        )}
      </svg>
      {/* Center Web3 Icon Badge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-400 p-0.5 shadow-md flex items-center justify-center border-2 border-white">
          <span className="text-slate-950 font-black text-xs">M</span>
        </div>
      </div>
    </div>
  );
};
