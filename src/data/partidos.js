import { equipos } from './equipos'

export const fases = [
  { id: 'grupos', nombre: 'Fase de Grupos', orden: 0, mult: 1 },
  { id: 'r32', nombre: 'Ronda de 32', orden: 1, mult: 1.5 },
  { id: 'r16', nombre: 'Octavos de Final', orden: 2, mult: 2 },
  { id: 'cuartos', nombre: 'Cuartos de Final', orden: 3, mult: 2.5 },
  { id: 'semis', nombre: 'Semifinales', orden: 4, mult: 3 },
  { id: 'tercero', nombre: 'Tercer Lugar', orden: 5, mult: 2.5 },
  { id: 'final', nombre: 'Final', orden: 6, mult: 4 },
]

// Jornadas de fase de grupos
export const jornadas = [
  { id: 1, nombre: 'Jornada 1', dias: '11-13 Jun' },
  { id: 2, nombre: 'Jornada 2', dias: '14-18 Jun' },
  { id: 3, nombre: 'Jornada 3', dias: '19-27 Jun' },
]

function crearPartido(id, fase, grupo, local, visita, fecha, jornada) {
  return { id, fase, grupo, local: local ?? null, visita: visita ?? null, marcador_local: null, marcador_visita: null, fecha: fecha || null, jornada: jornada || null, actualizado: false }
}

const gruposLista = ['A','B','C','D','E','F','G','H','I','J','K','L']
const partidosFaseGrupos = []
let pid = 1

// 12 grupos × 6 partidos = 72 partidos
// Asignación secuencial: 2 grupos por día, 4 partidos por día
function generarFechas(diaInicio, numPartidos) {
  const fechas = []
  for (let i = 0; i < numPartidos; i++) {
    const diaOffset = Math.floor(i / 4) // 4 partidos por día
    const d = diaInicio + diaOffset
    fechas.push(`2026-06-${String(d).padStart(2, '0')}`)
  }
  return fechas
}

const fechasJ1 = generarFechas(11, 24) // Jun 11-16 (2 grupos × 2 partidos × 6 días)
const fechasJ2 = generarFechas(17, 24) // Jun 17-22
const fechasJ3 = generarFechas(23, 24) // Jun 23-28

for (const g of gruposLista) {
  const eqs = equipos.filter(e => e.grupo === g)
  if (eqs.length === 4) {
    const matches = [[0,1],[2,3],[0,2],[1,3],[3,0],[1,2]]
    for (let idx = 0; idx < matches.length; idx++) {
      const [i, j] = matches[idx]
      const jornada = idx < 2 ? 1 : (idx < 4 ? 2 : 3)
      const globalIdx = gruposLista.indexOf(g) * 6 + idx
      const diaIdx = globalIdx % 24
      const fechaJ = [null, fechasJ1, fechasJ2, fechasJ3]
      const fecha = fechaJ[jornada][diaIdx]
      partidosFaseGrupos.push(
        crearPartido(`g-${g}-${pid}`, 'grupos', g, eqs[i].id, eqs[j].id, fecha, jornada)
      )
      pid++
    }
  }
}

// Eliminatorias con fechas reales
const fechasR32 = ['2026-06-28','2026-06-29','2026-06-30','2026-07-01','2026-07-02','2026-07-03']
const fechasR16 = ['2026-07-04','2026-07-05','2026-07-06','2026-07-07']
const fechasCF = ['2026-07-09','2026-07-10','2026-07-11']
const fechasSF = ['2026-07-14','2026-07-15']

let eliminatorias = []

for (let i = 0; i < 16; i++) {
  eliminatorias.push(crearPartido(`r32-${i+1}`, 'r32', null, null, null, fechasR32[i % fechasR32.length]))
}
for (let i = 0; i < 8; i++) {
  eliminatorias.push(crearPartido(`r16-${i+1}`, 'r16', null, null, null, fechasR16[i % fechasR16.length]))
}
for (let i = 0; i < 4; i++) {
  eliminatorias.push(crearPartido(`cf-${i+1}`, 'cuartos', null, null, null, fechasCF[i % fechasCF.length]))
}
eliminatorias.push(crearPartido('sf-1', 'semis', null, null, null, fechasSF[0]))
eliminatorias.push(crearPartido('sf-2', 'semis', null, null, null, fechasSF[1]))
eliminatorias.push(crearPartido('tp-1', 'tercero', null, null, null, '2026-07-18'))
eliminatorias.push(crearPartido('fn-1', 'final', null, null, null, '2026-07-19'))

export const partidos = [...partidosFaseGrupos, ...eliminatorias]

export const getPartidosPorFase = (fase) =>
  partidos.filter(p => p.fase === fase)

export const getPartidosPorJornada = (jornada) => {
  const gids = gruposLista.flatMap(g => {
    const eqs = equipos.filter(e => e.grupo === g)
    if (eqs.length !== 4) return []
    const matches = [[0,1],[2,3],[0,2],[1,3],[3,0],[1,2]]
    if (jornada === 1) return [0, 1]
    if (jornada === 2) return [2, 3]
    return [4, 5]
  })
  return partidos.filter(p => {
    if (p.fase !== 'grupos') return false
    const idx = partidosFaseGrupos.indexOf(p)
    return idx >= 0 && gids[idx]
  })
}

export const getFase = (faseId) =>
  fases.find(f => f.id === faseId)
