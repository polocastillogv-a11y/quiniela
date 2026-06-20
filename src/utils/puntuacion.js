import { partidos as datosPartidos, fases } from '../data/partidos'

function getResultadoReal(p) {
  if (p.marcador_local === null || p.marcador_visita === null) return null
  if (p.marcador_local > p.marcador_visita) return '1'
  if (p.marcador_visita > p.marcador_local) return '2'
  return 'X'
}

export function calcularPuntos(predicciones, participanteId, partidos, equiposParticipante = []) {
  let puntos = 0
  const detalles = []
  const preds = predicciones[participanteId] || {}
  const listaPartidos = partidos || datosPartidos

  for (const p of listaPartidos) {
    if (!p.actualizado) continue
    const pred = preds[p.id]
    if (!pred) continue
    if (equiposParticipante.length > 0 && !equiposParticipante.includes(p.local) && !equiposParticipante.includes(p.visita)) {
      if (participanteId !== 4) continue
      const pred = preds[p.id]
      if (!pred) continue
    }

    const fase = fases.find(f => f.id === p.fase)
    const mult = fase?.mult || 1
    const real = getResultadoReal(p)

    if (pred === real) {
      const pts = Math.round(1 * mult)
      puntos += pts
      detalles.push({ partidoId: p.id, concepto: `Acierto (${p.fase} x${mult})`, pts })
    }
  }

  return { puntos, detalles }
}
