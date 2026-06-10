import { equipos } from '../data/equipos'

export function fisherYatesShuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function realizarSorteo(participantes) {
  if (!participantes || participantes.length === 0) return []

  const activos = participantes.filter(p => p.activo !== false)
  if (activos.length === 0) return []

  const equiposBarajados = fisherYatesShuffle(equipos)
  const resultado = []

  let idx = 0
  for (const eq of equiposBarajados) {
    const p = activos[idx % activos.length]
    let entrada = resultado.find(r => r.participanteId === p.id)
    if (!entrada) {
      entrada = { participanteId: p.id, equipos: [] }
      resultado.push(entrada)
    }
    entrada.equipos.push(eq.id)
    idx++
  }

  return resultado
}
