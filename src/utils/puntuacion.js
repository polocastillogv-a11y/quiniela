import { partidos, fases } from '../data/partidos'

function getGanador(p) {
  if (p.marcador_local === null || p.marcador_visita === null) return null
  if (p.marcador_local > p.marcador_visita) return p.local
  if (p.marcador_visita > p.marcador_local) return p.visita
  return 'empate'
}

// Modalidad B: Puntos por desempeño de equipos sorteados
export function calcularPuntosSorteo(equiposParticipante) {
  let puntos = 0
  const detalles = []

  const gruposJugados = partidos.filter(p => p.fase === 'grupos' && p.actualizado)

  for (const eqId of equiposParticipante) {
    const partidosEq = gruposJugados.filter(p => p.local === eqId || p.visita === eqId)

    for (const p of partidosEq) {
      const ganador = getGanador(p)
      if (ganador === eqId) {
        puntos += 3
        detalles.push({ equipo: eqId, partidoId: p.id, concepto: 'Victoria en grupos', pts: 3 })
      } else if (ganador === 'empate') {
        puntos += 1
        detalles.push({ equipo: eqId, partidoId: p.id, concepto: 'Empate en grupos', pts: 1 })
      }
    }
  }

  return { puntos, detalles }
}

// Modalidad A: Puntos por pronósticos con multiplicadores por fase
export function calcularPuntosPronostico(pronosticos) {
  let puntos = 0
  const detalles = []

  for (const p of partidos) {
    if (!p.actualizado) continue
    const prono = pronosticos?.find(pr => pr.partidoId === p.id)
    if (!prono) continue

    const fase = fases.find(f => f.id === p.fase)
    const mult = fase?.mult || 1

    const ganadorReal = getGanador(p)
    const ganadorProno = getGanador({
      marcador_local: prono.local,
      marcador_visita: prono.visita
    })

    if (ganadorReal === ganadorProno) {
      const exacto = p.marcador_local === prono.local && p.marcador_visita === prono.visita
      if (exacto) {
        const pts = Math.round(3 * mult)
        puntos += pts
        detalles.push({ partidoId: p.id, concepto: `Marcador exacto (${p.fase} x${mult})`, pts })
      } else {
        const pts = Math.round(1 * mult)
        puntos += pts
        detalles.push({ partidoId: p.id, concepto: `Resultado correcto (${p.fase} x${mult})`, pts })
      }
    }
  }

  return { puntos, detalles }
}
