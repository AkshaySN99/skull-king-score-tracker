"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const [rounds, setRounds] = useState(5)
  const [players, setPlayers] = useState(2)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-[#8B4513]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Skull King Score Tracker
      </motion.h1>
      <motion.div 
        className="bg-[#FFD700] p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Game Setup</h2>
        <div className="mb-4">
          <label htmlFor="rounds" className="block mb-2">Number of Rounds (5-10):</label>
          <input 
            type="number" 
            id="rounds" 
            min="5" 
            max="10" 
            value={rounds} 
            onChange={(e) => setRounds(Number(e.target.value))}
            className="w-full p-2 rounded border border-[#8B4513]"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="players" className="block mb-2">Number of Players (2-8):</label>
          <input 
            type="number" 
            id="players" 
            min="2" 
            max="8" 
            value={players} 
            onChange={(e) => setPlayers(Number(e.target.value))}
            className="w-full p-2 rounded border border-[#8B4513]"
          />
        </div>
        <Link href={`/game?rounds=${rounds}&players=${players}`}>
          <motion.button 
            className="w-full bg-[#8B4513] text-white py-2 px-4 rounded hover:bg-[#6B3E0A] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Game
          </motion.button>
        </Link>
      </motion.div>
    </main>
  )
}

