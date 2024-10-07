import React from 'react'

interface GameBoardProps {
  snake: { x: number; y: number }[]
  food: { x: number; y: number }
  boardSize: number
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, boardSize }) => {
  const cellSize = 20

  return (
    <div
      className="border-2 border-gray-300"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
      }}
    >
      {Array.from({ length: boardSize * boardSize }).map((_, index) => {
        const x = index % boardSize
        const y = Math.floor(index / boardSize)
        const isSnake = snake.some((segment) => segment.x === x && segment.y === y)
        const isFood = food.x === x && food.y === y
        const isHead = snake[0].x === x && snake[0].y === y

        return (
          <div
            key={index}
            className={`
              ${isSnake ? 'bg-green-500' : ''}
              ${isFood ? 'bg-red-500' : ''}
              ${isHead ? 'bg-green-700' : ''}
            `}
            style={{ width: cellSize, height: cellSize }}
          />
        )
      })}
    </div>
  )
}

export default GameBoard