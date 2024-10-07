import React, { useState, useEffect, useCallback } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import GameBoard from './components/GameBoard'
import ScoreBoard from './components/ScoreBoard'
import { Direction, GameState } from './types'

const BOARD_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_FOOD = { x: 15, y: 15 }
const GAME_SPEED = 150

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState(INITIAL_FOOD)
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [gameState, setGameState] = useState<GameState>('READY')
  const [score, setScore] = useState(0)

  const moveSnake = useCallback(() => {
    if (gameState !== 'PLAYING') return

    const newSnake = [...snake]
    const head = { ...newSnake[0] }

    switch (direction) {
      case 'UP':
        head.y = (head.y - 1 + BOARD_SIZE) % BOARD_SIZE
        break
      case 'DOWN':
        head.y = (head.y + 1) % BOARD_SIZE
        break
      case 'LEFT':
        head.x = (head.x - 1 + BOARD_SIZE) % BOARD_SIZE
        break
      case 'RIGHT':
        head.x = (head.x + 1) % BOARD_SIZE
        break
    }

    newSnake.unshift(head)

    if (head.x === food.x && head.y === food.y) {
      setScore((prevScore) => prevScore + 1)
      setFood({
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      })
    } else {
      newSnake.pop()
    }

    if (isCollision(newSnake)) {
      setGameState('GAME_OVER')
    } else {
      setSnake(newSnake)
    }
  }, [snake, direction, food, gameState])

  const isCollision = (newSnake: { x: number; y: number }[]) => {
    const [head, ...body] = newSnake
    return body.some((segment) => segment.x === head.x && segment.y === head.y)
  }

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (gameState === 'READY' || gameState === 'GAME_OVER') {
        setGameState('PLAYING')
        return
      }

      switch (event.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP')
          break
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN')
          break
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT')
          break
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT')
          break
      }
    },
    [direction, gameState]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED)
    return () => clearInterval(gameLoop)
  }, [moveSnake])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection('RIGHT')
    setGameState('READY')
    setScore(0)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <ScoreBoard score={score} />
      <GameBoard
        snake={snake}
        food={food}
        boardSize={BOARD_SIZE}
      />
      {gameState === 'GAME_OVER' && (
        <div className="mt-4">
          <p className="text-xl font-semibold mb-2">Game Over!</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={resetGame}
          >
            Play Again
          </button>
        </div>
      )}
      {gameState === 'READY' && (
        <p className="mt-4 text-xl">Press any arrow key to start</p>
      )}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button className="p-2 bg-gray-200 rounded" onClick={() => handleKeyPress({ key: 'ArrowUp' } as KeyboardEvent)}>
          <ChevronUp size={24} />
        </button>
        <button className="p-2 bg-gray-200 rounded" onClick={() => handleKeyPress({ key: 'ArrowDown' } as KeyboardEvent)}>
          <ChevronDown size={24} />
        </button>
        <button className="p-2 bg-gray-200 rounded" onClick={() => handleKeyPress({ key: 'ArrowLeft' } as KeyboardEvent)}>
          <ChevronLeft size={24} />
        </button>
        <button className="p-2 bg-gray-200 rounded" onClick={() => handleKeyPress({ key: 'ArrowRight' } as KeyboardEvent)}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}

export default App