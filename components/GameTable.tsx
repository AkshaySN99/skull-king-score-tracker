import React from 'react'
import { motion } from 'framer-motion'
import { Pirata_One } from 'next/font/google'

const pirataOne = Pirata_One({ weight: '400', subsets: ['latin'] })


interface PlayerGameState {
  bet: number | null
  tricks: number | null
  score: number | null
  bonus: number | null
  total: number | null
}

interface GameTableProps {
  gameState: PlayerGameState[][]
  currentRound: number
  currentPhase: 'betting' | 'tricks'
  players: string[]
  // Change the type of 'field' to 'keyof PlayerGameState'
  updateGameState: (round: number, playerIndex: number, field: keyof PlayerGameState, value: number | null) => void
}


export default function GameTable({ gameState, currentRound, currentPhase, players, updateGameState }: GameTableProps) {
  const isEditable = (round: number, field: 'bet' | 'tricks' | 'bonus', playerData: PlayerGameState) => {
    return round === currentRound && 
           ((field === 'bet' && currentPhase === 'betting') || 
            (field === 'tricks' && currentPhase === 'tricks') ||
            (field === 'bonus' && currentPhase === 'tricks' && playerData.bet === playerData.tricks))
  }

  const calculateTotalScore = (playerIndex: number, upToRound: number) => {
    return gameState.slice(0, upToRound).reduce((total, round) => {
      return total + (round[playerIndex].total || 0)
    }, 0)
  }

  return (
    <div className="w-full overflow-x-auto bg-[#F3E5AB] p-4 rounded-lg shadow-lg">
      <table className={`w-full border-collapse max-w-4xl mx-auto ${pirataOne.className}`}>
        <thead>
          <tr>
            <th className="p-1 border-2 border-[#8B4513] bg-[#D2691E] text-white font-bold text-sm w-12">Round</th>
            {players.map((player, index) => (
              <th key={index} className="p-1 border-2 border-[#8B4513] bg-[#D2691E] text-white font-bold text-sm" colSpan={2}>
                <div>{player}</div>
                <div className="text-xs">Score: {calculateTotalScore(index, currentRound)}</div>
              </th>
            ))}
          </tr>
          <tr>
            <th className="p-1 border-2 border-[#8B4513] bg-[#D2691E]"></th>
            {players.map((_, index) => (
              <React.Fragment key={index}>
                <th className="p-1 border-2 border-[#8B4513] bg-[#DEB887] text-xs font-normal w-20">Bet / Tricks</th>
                <th className="p-1 border-2 border-[#8B4513] bg-[#DEB887] text-xs font-normal w-24">Score | Bonus<br />Total</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {gameState.map((round, roundIndex) => (
            <tr key={roundIndex} className={roundIndex % 2 === 0 ? 'bg-[#FAEBD7]' : 'bg-[#FFF8DC]'}>
              <td className={`p-1 border-2 border-[#8B4513] text-center font-bold ${roundIndex < currentRound - 1 ? 'bg-gray-300' : roundIndex > currentRound - 1 ? 'bg-gray-200' : ''}`}>
                <div className={`w-8 h-8 rounded-full ${roundIndex === currentRound - 1 ? 'bg-[#FFD700] w-10 h-10' : 'bg-[#8B4513]'} text-white flex items-center justify-center mx-auto text-xs`}>
                  {roundIndex + 1}
                </div>
              </td>
              {round.map((playerData: PlayerGameState, playerIndex) => (
                <React.Fragment key={playerIndex}>
                  <td className={`p-1 border-2 border-[#8B4513] ${roundIndex < currentRound - 1 ? 'bg-gray-300' : roundIndex > currentRound - 1 ? 'bg-gray-200' : ''}`}>
                    <div className="flex flex-col h-full">
                      <motion.input 
                        type="number" 
                        value={playerData.bet ?? ''}
                        onChange={(e) => updateGameState(roundIndex + 1, playerIndex, 'bet', e.target.value === '' ? null : Number(e.target.value))}
                        className={`w-full h-1/2 p-0.5 text-xs border-b ${isEditable(roundIndex + 1, 'bet', playerData) ? 'bg-white border-blue-500' : 'bg-gray-100 border-gray-300'}`}
                        disabled={!isEditable(roundIndex + 1, 'bet', playerData)}
                        min={0}
                        max={roundIndex + 1}
                        initial={false}
                        animate={isEditable(roundIndex + 1, 'bet', playerData) ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.5, repeat: 1 }}
                      />
                      <motion.input 
                        type="number" 
                        value={playerData.tricks ?? ''}
                        onChange={(e) => updateGameState(roundIndex + 1, playerIndex, 'tricks', e.target.value === '' ? null : Number(e.target.value))}
                        className={`w-full h-1/2 p-0.5 text-xs ${isEditable(roundIndex + 1, 'tricks', playerData) ? 'bg-white border-blue-500' : 'bg-gray-100 border-gray-300'}`}
                        disabled={!isEditable(roundIndex + 1, 'tricks', playerData)}
                        min={0}
                        max={roundIndex + 1}
                        initial={false}
                        animate={isEditable(roundIndex + 1, 'tricks', playerData) ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.5, repeat: 1 }}
                      />
                    </div>
                  </td>
                  <td className={`p-1 border-2 border-[#8B4513] ${roundIndex < currentRound - 1 ? 'bg-gray-300' : roundIndex > currentRound - 1 ? 'bg-gray-200' : ''}`}>
                    <div className="flex flex-col h-full">
                      <div className="flex h-2/3">
                        <span className="text-xs font-semibold bg-gray-100 p-0.5 w-1/2 border-r flex items-center justify-center">{playerData.score !== null ? playerData.score : ''}</span>
                        <motion.input 
                          type="number" 
                          value={playerData.bonus ?? ''}
                          onChange={(e) => updateGameState(roundIndex + 1, playerIndex, 'bonus', e.target.value === '' ? null : Number(e.target.value))}
                          className={`w-1/2 p-0.5 text-xs ${isEditable(roundIndex + 1, 'bonus', playerData) ? 'bg-white border-blue-500' : 'bg-gray-100 border-gray-300'}`}
                          disabled={!isEditable(roundIndex + 1, 'bonus', playerData)}
                          initial={false}
                          animate={isEditable(roundIndex + 1, 'bonus', playerData) ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 0.5, repeat: 1 }}
                        />
                      </div>
                      <div className="text-xs font-bold bg-gray-100 p-0.5 border-t h-1/3 flex items-center justify-center">{playerData.total !== null ? playerData.total : ''}</div>
                    </div>
                  </td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

