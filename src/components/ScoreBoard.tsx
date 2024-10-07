import React from 'react'

interface ScoreBoardProps {
  score: number
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold">Score: {score}</h2>
    </div>
  )
}

export default ScoreBoard