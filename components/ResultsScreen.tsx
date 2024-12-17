import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Pirata_One } from 'next/font/google'

const pirataOne = Pirata_One({ weight: '400', subsets: ['latin'] })

interface ResultsScreenProps {
  gameState: any[][]
  players: string[]
  onNewGame: () => void
}

export default function ResultsScreen({ gameState, players, onNewGame }: ResultsScreenProps) {
  const [finalScores, setFinalScores] = useState<{ name: string, score: number }[]>([])
  const [winnerIndex, setWinnerIndex] = useState<number>(-1)

  useEffect(() => {
    const scores = players.map((player, index) => ({
      name: player,
      score: gameState.reduce((total, round) => total + (round[index].total || 0), 0)
    }))
    scores.sort((a, b) => b.score - a.score)
    setFinalScores(scores)
    setWinnerIndex(players.indexOf(scores[0].name))
  }, [gameState, players])

  const downloadPDF = () => {
    const input = document.getElementById('results-table')
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('l', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save('skull-king-results.pdf')
      })
    }
  }

  const downloadImage = () => {
    const input = document.getElementById('results-table')
    if (input) {
      html2canvas(input).then((canvas) => {
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = 'skull-king-results.png'
        link.click()
      })
    }
  }

  return (
    <motion.div 
      className={`flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-[#D2B48C] ${pirataOne.className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-[#8B4513]">Final Results</h2>
      <div id="results-table" className="bg-[#FFD700] p-8 rounded-lg shadow-lg mb-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-2 border-[#8B4513] bg-[#D2691E] text-white">Round</th>
              {players.map((player, index) => (
                <th key={index} className={`p-2 border-2 border-[#8B4513] bg-[#D2691E] text-white ${index === winnerIndex ? 'bg-[#FFD700] text-[#8B4513]' : ''}`} colSpan={3}>
                  {player}
                </th>
              ))}
            </tr>
            <tr>
              <th className="p-2 border-2 border-[#8B4513] bg-[#DEB887]"></th>
              {players.map((_, index) => (
                <React.Fragment key={index}>
                  <th className="p-2 border-2 border-[#8B4513] bg-[#DEB887] text-xs">Bet</th>
                  <th className="p-2 border-2 border-[#8B4513] bg-[#DEB887] text-xs">Tricks</th>
                  <th className="p-2 border-2 border-[#8B4513] bg-[#DEB887] text-xs">Score</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {gameState.map((round, roundIndex) => (
              <tr key={roundIndex} className={roundIndex % 2 === 0 ? 'bg-[#FAEBD7]' : 'bg-[#FFF8DC]'}>
                <td className="p-2 border-2 border-[#8B4513] text-center font-bold">{roundIndex + 1}</td>
                {round.map((playerData, playerIndex) => (
                  <React.Fragment key={playerIndex}>
                    <td className={`p-2 border-2 border-[#8B4513] text-center ${playerIndex === winnerIndex ? 'bg-[#FFD700]' : ''}`}>{playerData.bet}</td>
                    <td className={`p-2 border-2 border-[#8B4513] text-center ${playerIndex === winnerIndex ? 'bg-[#FFD700]' : ''}`}>{playerData.tricks}</td>
                    <td className={`p-2 border-2 border-[#8B4513] text-center ${playerIndex === winnerIndex ? 'bg-[#FFD700]' : ''}`}>{playerData.total}</td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
            <tr className="bg-[#DEB887] font-bold">
              <td className="p-2 border-2 border-[#8B4513] text-center">Total</td>
              {finalScores.map((score, index) => (
                <td key={index} className={`p-2 border-2 border-[#8B4513] text-center ${index === winnerIndex ? 'bg-[#FFD700]' : ''}`} colSpan={3}>
                  {score.score}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex space-x-4">
        <motion.button 
          className="bg-[#8B4513] text-white py-2 px-4 rounded hover:bg-[#6B3E0A] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadPDF}
        >
          Download PDF
        </motion.button>
        <motion.button 
          className="bg-[#8B4513] text-white py-2 px-4 rounded hover:bg-[#6B3E0A] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadImage}
        >
          Download Image
        </motion.button>
        <motion.button 
          className="bg-[#8B4513] text-white py-2 px-4 rounded hover:bg-[#6B3E0A] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewGame}
        >
          New Game
        </motion.button>
      </div>
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4 text-[#8B4513]">Winner's Podium</h3>
        <div className="flex items-end justify-center space-x-4">
          <div className="flex flex-col items-center">
            <div className="bg-[#C0C0C0] w-24 h-32 flex items-center justify-center rounded-t-lg">
              <span className="text-xl font-bold">{finalScores[1]?.name}</span>
            </div>
            <div className="bg-[#8B4513] w-24 h-8 flex items-center justify-center">
              <span className="text-white font-bold">2nd</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-[#FFD700] w-24 h-40 flex items-center justify-center rounded-t-lg">
              <span className="text-xl font-bold">{finalScores[0]?.name}</span>
            </div>
            <div className="bg-[#8B4513] w-24 h-8 flex items-center justify-center">
              <span className="text-white font-bold">1st</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-[#CD7F32] w-24 h-24 flex items-center justify-center rounded-t-lg">
              <span className="text-xl font-bold">{finalScores[2]?.name}</span>
            </div>
            <div className="bg-[#8B4513] w-24 h-8 flex items-center justify-center">
              <span className="text-white font-bold">3rd</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

