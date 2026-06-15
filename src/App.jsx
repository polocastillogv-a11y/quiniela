import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import useParticipantesStore from './store/participantesStore'
import useQuinielaStore from './store/quinielaStore'
import useSorteoStore from './store/sorteoStore'
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

  useEffect(() => {
    initP()
    initQ()
    initS()
  }, [])

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
