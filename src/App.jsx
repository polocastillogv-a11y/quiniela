import { useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import useParticipantesStore from './store/participantesStore'
import useQuinielaStore from './store/quinielaStore'
import useSorteoStore from './store/sorteoStore'
import useBackgroundStore from './store/backgroundStore'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Participantes from './pages/Participantes'
import Sorteo from './pages/Sorteo'
import Quiniela from './pages/Quiniela'
import Bolsa from './pages/Bolsa'
import Bracket from './pages/Bracket'
import Resultados from './pages/Resultados'
import Partidos from './pages/Partidos'

export default function App() {
  const initP = useParticipantesStore(s => s.init)
  const initQ = useQuinielaStore(s => s.init)
  const initS = useSorteoStore(s => s.init)
  const fetchLiveScores = useQuinielaStore(s => s.fetchLiveScores)
  const setAlternate = useBackgroundStore(s => s.setAlternate)
  const seqRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    initP()
    initQ()
    initS()
    const t = setTimeout(fetchLiveScores, 3000)
    const interval = setInterval(fetchLiveScores, 120000)
    return () => { clearTimeout(t); clearInterval(interval) }
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      seqRef.current.push(e.key)
      if (seqRef.current.length > 3) seqRef.current.shift()
      if (seqRef.current.join('') === '912') {
        setAlternate(true)
        seqRef.current = []
      }
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => { seqRef.current = [] }, 2000)
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      clearTimeout(timerRef.current)
    }
  }, [setAlternate])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/participantes" element={<Participantes />} />
        <Route path="/sorteo" element={<Sorteo />} />
        <Route path="/quiniela" element={<Quiniela />} />
        <Route path="/partidos" element={<Partidos />} />
        <Route path="/bolsa" element={<Bolsa />} />
        <Route path="/bracket" element={<Bracket />} />
        <Route path="/resultados" element={<Resultados />} />
      </Routes>
    </Layout>
  )
}
