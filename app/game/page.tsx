"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import PlayerNameInput from '@/components/PlayerNameInput'
import GameTable from '@/components/GameTable'
import ResultsScreen from '@/components/ResultsScreen'
import { Pirata_One } from 'next/font/google'

const pirataOne = Pirata_One({ weight: '400', subsets: ['latin'] })

export default function Game() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const rounds = Number(searchParams.get('rounds')) || 5
  const playerCount = Number(searchParams.get('players')) || 2

  const [players, setPlayers] = useState<string[]>([])
  const [currentRound, setCurrentRound] = useState(1)
  const [gameState, setGameState] = useState<any[][]>([])
  const [gameFinished, setGameFinished] = useState(false)
  const [phase, setPhase] = useState<'betting' | 'tricks'>('betting')

  useEffect(() => {
    setGameState(Array(rounds).fill(null).map(() => 
      Array(playerCount).fill(null).map(() => ({
        bet: null,
        tricks: null,
        score: null,
        bonus: null,
        total: null
      }))
    ))
  }, [rounds, playerCount])

  const handlePlayerNamesSubmit = (names: string[]) => {
    setPlayers(names)
  }

  const calculateScore = (bet: number, tricks: number, roundNumber: number) => {
    if (bet === 0) {
      return tricks === 0 ? roundNumber * 10 : -roundNumber * 10
    }
    return bet === tricks ? bet * 20 : -Math.abs(bet - tricks) * 10
  }

  const handleNextPhase = () => {
    if (phase === 'betting') {
      const allBetsEntered = gameState[currentRound - 1].every(
        player => player.bet !== null && player.bet >= 0 && player.bet <= currentRound
      )
      if (allBetsEntered) {
        setPhase('tricks')
      }
    } else {
      const allTricksAndBonusEntered = gameState[currentRound - 1].every(
        player => player.tricks !== null && player.tricks >= 0 && player.tricks <= currentRound
      )
      if (allTricksAndBonusEntered) {
        if (currentRound < rounds) {
          setCurrentRound(currentRound + 1)
          setPhase('betting')
        } else {
          setGameFinished(true)
        }
      }
    }
  }

  const updateGameState = (round: number, playerIndex: number, field: string, value: number | null) => {
    if ((field === 'bet' || field === 'tricks') && (typeof value !== 'number' || value < 0 || value > round)) return

    const newGameState = [...gameState]
    newGameState[round - 1][playerIndex][field] = value

    if (field === 'tricks' || field === 'bonus') {
      const bet = newGameState[round - 1][playerIndex].bet
      const tricks = newGameState[round - 1][playerIndex].tricks
      if (bet !== null && tricks !== null) {
        const score = calculateScore(bet, tricks, round)
        newGameState[round - 1][playerIndex].score = score
        
        const bonus = newGameState[round - 1][playerIndex].bonus ?? 0
        newGameState[round - 1][playerIndex].total = score + bonus
      }
    }

    setGameState(newGameState)
  }

  const handleExitGame = () => {
    router.push('/')
  }

  if (players.length === 0) {
    return <PlayerNameInput playerCount={playerCount} onSubmit={handlePlayerNamesSubmit} />
  }

  if (gameFinished) {
    return <ResultsScreen gameState={gameState} players={players} onNewGame={handleExitGame} />
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-start p-4 md:p-24 bg-[#D2B48C] ${pirataOne.className}`}>
      <div className="w-full max-w-4xl flex justify-between items-center mb-4">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-[#8B4513]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Round {currentRound} - {phase === 'betting' ? 'Betting Phase' : 'Tricks Phase'}
        </motion.h1>
        <motion.button
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExitGame}
        >
          Exit Game
        </motion.button>
      </div>
      <GameTable 
        gameState={gameState} 
        currentRound={currentRound}
        currentPhase={phase}
        players={players} 
        updateGameState={updateGameState}
      />
      <motion.button 
        className="mt-4 bg-[#8B4513] text-white py-2 px-4 rounded hover:bg-[#6B3E0A] transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNextPhase}
      >
        {phase === 'betting' ? 'Start Round' : currentRound < rounds ? 'Next Round' : 'Finish Game'}
      </motion.button>
    </main>
  )
}

