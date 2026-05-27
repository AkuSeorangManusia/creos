"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const COLS = 10;
const ROWS = 20;

const PIECES = [
    {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        color: "#00f0f0",
    },
    {
        shape: [
            [1, 1],
            [1, 1],
        ],
        color: "#f0f000",
    },
    {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        color: "#a000f0",
    },
    {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
        color: "#00f000",
    },
    {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],
        color: "#f00000",
    },
    {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        color: "#0000f0",
    },
    {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
        ],
        color: "#f0a000",
    },
];

function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function rotate(m) {
    const n = m.length;
    const r = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) r[j][n - 1 - i] = m[i][j];
    return r;
}

function isValid(board, shape, row, col) {
    for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[r].length; c++)
            if (shape[r][c]) {
                const br = row + r,
                    bc = col + c;
                if (bc < 0 || bc >= COLS || br >= ROWS) return false;
                if (br >= 0 && board[br][bc]) return false;
            }
    return true;
}

function ghostRow(board, shape, row, col) {
    let r = row;
    while (isValid(board, shape, r + 1, col)) r++;
    return r;
}

function merge(board, shape, color, row, col) {
    const b = board.map((r) => [...r]);
    for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[r].length; c++)
            if (shape[r][c] && row + r >= 0) b[row + r][col + c] = color;
    return b;
}

function spawnPiece(game) {
    if (game.gameOver) return;

    if (game.bag.length === 0) {
        game.bag.push(
            ...PIECES.map((p) => ({ ...p, shape: p.shape.map((r) => [...r]) })),
        );
        shuffle(game.bag);
    }
    const { shape, color } = game.bag.pop();
    const col = Math.floor((COLS - shape[0].length) / 2);
    const row = -1;

    if (!isValid(game.board, shape, row, col)) {
        game.gameOver = true;
        return;
    }

    game.piece = { shape, color, row, col };

    if (game.bag.length === 0) {
        game.bag.push(
            ...PIECES.map((p) => ({ ...p, shape: p.shape.map((r) => [...r]) })),
        );
        shuffle(game.bag);
    }
    game.next = game.bag[game.bag.length - 1];
}

function lockPiece(game) {
    if (!game.piece) return;

    const { shape, color, row, col } = game.piece;
    game.board = merge(game.board, shape, color, row, col);
    game.piece = null;

    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (game.board[r].every((c) => c !== null)) {
            game.board.splice(r, 1);
            game.board.unshift(Array(COLS).fill(null));
            cleared++;
            r++;
        }
    }

    if (cleared > 0) {
        const pts = [0, 40, 100, 300, 1200];
        game.score += (pts[cleared] || 0) * game.level;
        game.lines += cleared;
        game.level = Math.floor(game.lines / 10) + 1;
    }

    spawnPiece(game);
}

function getDropInterval(level) {
    return Math.max(50, 1000 - (level - 1) * 75);
}

function hexToRgba(hex, alpha) {
    const r = Number.parseInt(hex.slice(1, 3), 16);
    const g = Number.parseInt(hex.slice(3, 5), 16);
    const b = Number.parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

export default function Tetris() {
    const [, update] = useState(0);
    const render = useCallback(() => update((n) => n + 1), []);

    const gameRef = useRef({
        board: createBoard(),
        piece: null,
        next: null,
        score: 0,
        level: 1,
        lines: 0,
        gameOver: false,
        paused: false,
        bag: [],
    });
    const timeoutRef = useRef(null);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const cellSize = isMobile ? 20 : 26;
    const nextCellSize = isMobile ? 14 : 22;
    const boardWidth = COLS * (cellSize + 1) + 1;

    const tick = useCallback(() => {
        const gs = gameRef.current;
        if (gs.gameOver) return;

        if (!gs.paused && gs.piece) {
            const { shape, row, col } = gs.piece;
            if (isValid(gs.board, shape, row + 1, col)) {
                gs.piece.row++;
                render();
            } else {
                lockPiece(gs);
                render();
            }
        }

        timeoutRef.current = setTimeout(tick, getDropInterval(gs.level));
    }, [render]);

    const startLoop = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        tick();
    }, [tick]);

    useEffect(() => {
        const g = gameRef.current;
        g.bag.push(
            ...PIECES.map((p) => ({ ...p, shape: p.shape.map((r) => [...r]) })),
        );
        shuffle(g.bag);
        spawnPiece(g);
        render();
        startLoop();
        return () => clearTimeout(timeoutRef.current);
    }, [render, startLoop]);

    const moveLeft = useCallback(() => {
        const game = gameRef.current;
        if (!game.piece || game.paused || game.gameOver) return;
        const { shape, row, col } = game.piece;
        if (isValid(game.board, shape, row, col - 1)) {
            game.piece.col--;
            render();
        }
    }, [render]);

    const moveRight = useCallback(() => {
        const game = gameRef.current;
        if (!game.piece || game.paused || game.gameOver) return;
        const { shape, row, col } = game.piece;
        if (isValid(game.board, shape, row, col + 1)) {
            game.piece.col++;
            render();
        }
    }, [render]);

    const moveDown = useCallback(() => {
        const game = gameRef.current;
        if (!game.piece || game.paused || game.gameOver) return;
        const { shape, row, col } = game.piece;
        if (isValid(game.board, shape, row + 1, col)) {
            game.piece.row++;
            game.score += 1;
            render();
        }
    }, [render]);

    const rotatePiece = useCallback(() => {
        const game = gameRef.current;
        if (!game.piece || game.paused || game.gameOver) return;
        const { shape, row, col } = game.piece;
        const rotated = rotate(shape);
        if (isValid(game.board, rotated, row, col)) {
            game.piece.shape = rotated;
            render();
        }
    }, [render]);

    const hardDrop = useCallback(() => {
        const game = gameRef.current;
        if (!game.piece || game.paused || game.gameOver) return;
        const { shape, row, col } = game.piece;
        const gr = ghostRow(game.board, shape, row, col);
        game.score += (gr - row) * 2;
        game.piece.row = gr;
        lockPiece(game);
        render();
    }, [render]);

    const togglePause = useCallback(() => {
        const game = gameRef.current;
        if (game.gameOver) return;
        game.paused = !game.paused;
        render();
    }, [render]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const game = gameRef.current;

            if (game.gameOver) return;

            if (e.key === "p" || e.key === "P") {
                game.paused = !game.paused;
                render();
                e.preventDefault();
                return;
            }

            if (game.paused || !game.piece) return;

            switch (e.key) {
                case "ArrowLeft":
                    moveLeft();
                    break;
                case "ArrowRight":
                    moveRight();
                    break;
                case "ArrowDown":
                    moveDown();
                    break;
                case "ArrowUp":
                    rotatePiece();
                    break;
                case " ":
                    hardDrop();
                    break;
                default:
                    return;
            }

            e.preventDefault();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [render, moveLeft, moveRight, moveDown, rotatePiece, hardDrop]);

    const g = gameRef.current;
    const piece = g.piece;
    const ghost = piece
        ? ghostRow(g.board, piece.shape, piece.row, piece.col)
        : null;

    const display = g.board.map((row) => [...row]);

    if (piece) {
        if (ghost !== piece.row) {
            for (let r = 0; r < piece.shape.length; r++) {
                for (let c = 0; c < piece.shape[r].length; c++) {
                    if (piece.shape[r][c]) {
                        const dr = ghost + r;
                        const dc = piece.col + c;
                        if (
                            dr >= 0 &&
                            dr < ROWS &&
                            dc >= 0 &&
                            dc < COLS &&
                            !display[dr][dc]
                        ) {
                            display[dr][dc] = "ghost";
                        }
                    }
                }
            }
        }

        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c]) {
                    const dr = piece.row + r;
                    const dc = piece.col + c;
                    if (dr >= 0 && dr < ROWS && dc >= 0 && dc < COLS) {
                        display[dr][dc] = piece.color;
                    }
                }
            }
        }
    }

    const renderBoard = (size) => (
        <div
            className="bg-gray-900 border-2 border-gray-400 flex-shrink-0"
            style={{
                width: COLS * (size + 1) + 1,
                height: ROWS * (size + 1) + 1,
                display: "grid",
                gridTemplateColumns: `repeat(${COLS}, ${size}px)`,
                gridTemplateRows: `repeat(${ROWS}, ${size}px)`,
                gap: "1px",
                padding: "1px",
            }}
        >
            {display.flat().map((cell, i) => {
                const row = Math.floor(i / COLS);
                const col = i % COLS;
                let bg;
                let border;
                if (cell === null) {
                    bg = "#0a0a1a";
                    border = "1px solid #1a1a3e";
                } else if (cell === "ghost") {
                    bg = "transparent";
                    border = `1px dashed ${piece ? hexToRgba(piece.color, 0.4) : "rgba(255,255,255,0.2)"}`;
                } else {
                    bg = cell;
                    border = "1px solid rgba(0,0,0,0.25)";
                }
                return (
                    <div
                        key={`${row}-${col}`}
                        style={{
                            width: size,
                            height: size,
                            backgroundColor: bg,
                            border,
                            borderRadius: 1,
                        }}
                    />
                );
            })}
        </div>
    );

    const renderNextPiece = (size) => {
        if (!g.next) return null;
        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${g.next.shape[0].length}, ${size}px)`,
                    gridTemplateRows: `repeat(${g.next.shape.length}, ${size}px)`,
                    gap: "1px",
                }}
            >
                {g.next.shape.flat().map((cell, i) => {
                    const nr = Math.floor(i / g.next.shape[0].length);
                    const nc = i % g.next.shape[0].length;
                    return (
                        <div
                            key={`next-${nr}-${nc}`}
                            style={{
                                width: size,
                                height: size,
                                backgroundColor: cell
                                    ? g.next.color
                                    : "transparent",
                                border: cell
                                    ? "1px solid rgba(0,0,0,0.2)"
                                    : "none",
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    const ctrlBtn =
        "flex items-center justify-center bg-gray-200 border-2 border-gray-400 active:bg-gray-300 active:border-gray-500 text-black font-bold select-none touch-manipulation";

    if (isMobile) {
        return (
            <div
                className="w-full h-full flex flex-col p-1 select-none gap-1"
                style={{ cursor: "default" }}
            >
                <div className="flex items-start justify-center gap-1 flex-1 min-h-0">
                    <div className="flex flex-col gap-1 pt-1">
                        <div className="bg-gray-200 border border-gray-400 px-1 py-0.5 text-center">
                            <div
                                className="text-black font-bold leading-tight"
                                style={{ fontSize: 9 }}
                            >
                                LV
                            </div>
                            <div
                                className="text-green-700 font-bold leading-tight"
                                style={{ fontSize: 13 }}
                            >
                                {g.level}
                            </div>
                        </div>
                        <div className="bg-gray-200 border border-gray-400 px-1 py-0.5 text-center">
                            <div
                                className="text-black font-bold leading-tight"
                                style={{ fontSize: 9 }}
                            >
                                LN
                            </div>
                            <div
                                className="text-green-700 font-bold leading-tight"
                                style={{ fontSize: 13 }}
                            >
                                {g.lines}
                            </div>
                        </div>
                    </div>

                    {renderBoard(cellSize)}

                    <div className="flex flex-col gap-1 pt-1">
                        {g.next && (
                            <div className="bg-gray-200 border border-gray-400 px-1 py-0.5">
                                <div
                                    className="text-black font-bold text-center leading-tight"
                                    style={{ fontSize: 9 }}
                                >
                                    NX
                                </div>
                                <div className="flex justify-center">
                                    {renderNextPiece(nextCellSize)}
                                </div>
                            </div>
                        )}
                        <div className="bg-gray-200 border border-gray-400 px-1 py-0.5 text-center">
                            <div
                                className="text-black font-bold leading-tight"
                                style={{ fontSize: 9 }}
                            >
                                SC
                            </div>
                            <div
                                className="text-green-700 font-bold leading-tight"
                                style={{ fontSize: 11 }}
                            >
                                {g.score.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1 pb-1">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className={`${ctrlBtn} rounded`}
                            style={{ width: 48, height: 44, fontSize: 20 }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => {
                                e.stopPropagation();
                                moveLeft();
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                moveLeft();
                            }}
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            className={`${ctrlBtn} rounded`}
                            style={{ width: 48, height: 44, fontSize: 20 }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => {
                                e.stopPropagation();
                                moveDown();
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                moveDown();
                            }}
                        >
                            ↓
                        </button>
                        <button
                            type="button"
                            className={`${ctrlBtn} rounded`}
                            style={{ width: 48, height: 44, fontSize: 20 }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => {
                                e.stopPropagation();
                                moveRight();
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                moveRight();
                            }}
                        >
                            →
                        </button>
                    </div>

                    <button
                        type="button"
                        className={`${ctrlBtn} rounded`}
                        style={{ width: 100, height: 40, fontSize: 20 }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => {
                            e.stopPropagation();
                            rotatePiece();
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            rotatePiece();
                        }}
                    >
                        ↻
                    </button>

                    <button
                        type="button"
                        className={`${ctrlBtn} rounded font-bold`}
                        style={{
                            width: boardWidth,
                            height: 40,
                            fontSize: 13,
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => {
                            e.stopPropagation();
                            hardDrop();
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            hardDrop();
                        }}
                    >
                        HARD DROP
                    </button>

                    <button
                        type="button"
                        className={`${ctrlBtn} px-3 py-1 rounded`}
                        style={{ fontSize: 11 }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePause();
                        }}
                    >
                        {g.paused ? "▶ RESUME" : "⏸ PAUSE"}
                    </button>
                </div>

                {g.gameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                        <div className="bg-red-100 border-2 border-red-400 p-3 text-center mx-4">
                            <div className="text-red-600 font-bold text-xl leading-none mb-2">
                                GAME OVER
                            </div>
                            <button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-base leading-none"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const newGame = {
                                        board: createBoard(),
                                        piece: null,
                                        next: null,
                                        score: 0,
                                        level: 1,
                                        lines: 0,
                                        gameOver: false,
                                        paused: false,
                                        bag: [],
                                    };
                                    newGame.bag.push(
                                        ...PIECES.map((p) => ({
                                            ...p,
                                            shape: p.shape.map((r) => [...r]),
                                        })),
                                    );
                                    shuffle(newGame.bag);
                                    spawnPiece(newGame);
                                    gameRef.current = newGame;
                                    render();
                                    startLoop();
                                }}
                            >
                                Restart
                            </button>
                        </div>
                    </div>
                )}

                {g.paused && !g.gameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                        <div className="bg-yellow-100 border-2 border-yellow-400 p-3 text-center mx-4">
                            <div className="text-yellow-700 font-bold text-xl leading-none">
                                PAUSED
                            </div>
                            <div className="text-gray-600 text-xs leading-none mt-1">
                                Tap Resume to continue
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className="w-full h-full flex gap-4 p-2 select-none"
            style={{ cursor: "default" }}
        >
            {renderBoard(cellSize)}

            <div className="flex flex-col gap-3 flex-1 min-w-0">
                {g.next && (
                    <div className="bg-gray-200 border-2 border-gray-400 p-2">
                        <div className="text-black font-bold text-lg leading-none mb-2">
                            Next
                        </div>
                        <div className="flex items-center justify-center">
                            {renderNextPiece(nextCellSize)}
                        </div>
                    </div>
                )}

                <div className="bg-gray-200 border-2 border-gray-400 p-2">
                    <div className="text-black font-bold text-lg leading-none mb-1">
                        Score
                    </div>
                    <div className="text-green-700 text-2xl font-bold leading-none">
                        {g.score.toLocaleString()}
                    </div>
                </div>

                <div className="bg-gray-200 border-2 border-gray-400 p-2">
                    <div className="text-black font-bold text-lg leading-none mb-1">
                        Level
                    </div>
                    <div className="text-green-700 text-2xl font-bold leading-none">
                        {g.level}
                    </div>
                </div>

                <div className="bg-gray-200 border-2 border-gray-400 p-2">
                    <div className="text-black font-bold text-lg leading-none mb-1">
                        Lines
                    </div>
                    <div className="text-green-700 text-2xl font-bold leading-none">
                        {g.lines}
                    </div>
                </div>

                <div className="bg-gray-200 border-2 border-gray-400 p-2 mt-auto">
                    <div className="text-black font-bold text-lg leading-none mb-1">
                        Controls
                    </div>
                    <div className="text-gray-700 text-sm leading-tight">
                        <div>← → Move</div>
                        <div>↑ Rotate</div>
                        <div>↓ Soft drop</div>
                        <div>Space Hard drop</div>
                        <div>P Pause</div>
                    </div>
                </div>

                {g.gameOver && (
                    <div className="bg-red-100 border-2 border-red-400 p-2 text-center">
                        <div className="text-red-600 font-bold text-2xl leading-none mb-2">
                            GAME OVER
                        </div>
                        <button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-lg leading-none"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                const newGame = {
                                    board: createBoard(),
                                    piece: null,
                                    next: null,
                                    score: 0,
                                    level: 1,
                                    lines: 0,
                                    gameOver: false,
                                    paused: false,
                                    bag: [],
                                };
                                newGame.bag.push(
                                    ...PIECES.map((p) => ({
                                        ...p,
                                        shape: p.shape.map((r) => [...r]),
                                    })),
                                );
                                shuffle(newGame.bag);
                                spawnPiece(newGame);
                                gameRef.current = newGame;
                                render();
                                startLoop();
                            }}
                        >
                            Restart
                        </button>
                    </div>
                )}

                {g.paused && !g.gameOver && (
                    <div className="bg-yellow-100 border-2 border-yellow-400 p-2 text-center">
                        <div className="text-yellow-700 font-bold text-2xl leading-none">
                            PAUSED
                        </div>
                        <div className="text-gray-600 text-sm leading-none mt-1">
                            Press P to resume
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
