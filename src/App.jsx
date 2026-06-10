import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { partidos as datosPartidos } from './data/partidos'
import useQuinielaStore from './store/quinielaStore'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Participantes from './pages/Participantes'
import Quiniela from './pages/Quiniela'
import Bolsa from './pages/Bolsa'
import Bracket from './pages/Bracket'
import Resultados from './pages/Resultados'

export default function App() {
  const setPartidos = useQuinielaStore(s => s.setPartidos)

  useEffect(() => {
    setPartidos(datosPartidos)
  }, [])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/participantes" element={<Participantes />} />
        <Route path="/quiniela" element={<Quiniela />} />
        <Route path="/bolsa" element={<Bolsa />} />
        <Route path="/bracket" element={<Bracket />} />
        <Route path="/resultados" element={<Resultados />} />
      </Routes>
    </Layout>
  )
}
