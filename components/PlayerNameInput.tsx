import { useState } from 'react'
import { motion } from 'framer-motion'

interface PlayerNameInputProps {
  playerCount: number
  onSubmit: (names: string[]) => void
}

export default function PlayerNameInput({ playerCount, onSubmit }: PlayerNameInputProps) {
  const [names, setNames] = useState<string[]>(Array(playerCount).fill(''))

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names]
    newNames[index] = value
    setNames(newNames)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(names)
  }

  return (
    <motion.div 
      className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-[#8B4513]">Enter Player Names</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        {names.map((name, index) => (
          <div key={index} className="mb-4">
            <label htmlFor={`player${index + 1}`} className="block mb-2">Player {index + 1}:</label>
            <input 
              type="text" 
              id={`player${index + 1}`}
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              required
              className="w-full p-2 rounded border border-[#8B4513]"
            />
          </div>
        ))}
        <motion.button 
          type="submit"
          className="w-full bg-[#8B4513] text-white py-2 px-4 rounded hover:bg-[#6B3E0A] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Game
        </motion.button>
      </form>
    </motion.div>
  )
}

