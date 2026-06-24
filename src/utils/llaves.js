import { equipos } from '../data/equipos'

const GRUPOS = ['A','B','C','D','E','F','G','H','I','J','K','L']

// Fixed R32 pairings: 1st vs 2nd
const FIJOS = [
  { n: 1,  local: { tipo: '1', grupo: 'A' }, visita: { tipo: '2', grupo: 'B' } },
  { n: 2,  local: { tipo: '1', grupo: 'B' }, visita: { tipo: '2', grupo: 'A' } },
  { n: 3,  local: { tipo: '1', grupo: 'C' }, visita: { tipo: '2', grupo: 'D' } },
  { n: 4,  local: { tipo: '1', grupo: 'D' }, visita: { tipo: '2', grupo: 'C' } },
  { n: 5,  local: { tipo: '1', grupo: 'E' }, visita: { tipo: '2', grupo: 'F' } },
  { n: 6,  local: { tipo: '1', grupo: 'F' }, visita: { tipo: '2', grupo: 'E' } },
  { n: 7,  local: { tipo: '1', grupo: 'G' }, visita: { tipo: '2', grupo: 'H' } },
  { n: 8,  local: { tipo: '1', grupo: 'H' }, visita: { tipo: '2', grupo: 'G' } },
  { n: 9,  local: { tipo: '1', grupo: 'I' }, visita: { tipo: '2', grupo: 'J' } },
  { n: 10, local: { tipo: '1', grupo: 'J' }, visita: { tipo: '2', grupo: 'I' } },
  { n: 11, local: { tipo: '1', grupo: 'K' }, visita: { tipo: '2', grupo: 'L' } },
  { n: 12, local: { tipo: '1', grupo: 'L' }, visita: { tipo: '2', grupo: 'K' } },
]

// Third-place slot pools (FIFA Official)
const TERCEROS = [
  { n: 13, local: ['A','B','C'], visita: ['D','E','F'] },
  { n: 14, local: ['G','H','I'], visita: ['J','K','L'] },
  { n: 15, local: ['A','B','D'], visita: ['C','E','G'] },
  { n: 16, local: ['F','H','J'], visita: ['I','K','L'] },
]

function getResultadoReal(p) {
  if (p.marcador_local === null || p.marcador_visita === null) return null
  if (p.marcador_local > p.marcador_visita) return '1'
  if (p.marcador_visita > p.marcador_local) return '2'
  return 'X'
}

export function calcularTablasGrupos(partidos) {
  const grupos = {}
  for (const g of GRUPOS) {
    const eqs = equipos.filter(e => e.grupo === g)
    const stats = {}
    for (const eq of eqs) {
      stats[eq.id] = { equipo: eq.id, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 }
    }
    const gMatches = partidos.filter(p => p.grupo === g && p.actualizado)
    for (const m of gMatches) {
      const res = getResultadoReal(m)
      if (!res) continue
      stats[m.local].pj++
      stats[m.local].gf += m.marcador_local
      stats[m.local].gc += m.marcador_visita
      stats[m.visita].pj++
      stats[m.visita].gf += m.marcador_visita
      stats[m.visita].gc += m.marcador_local
      if (res === '1') { stats[m.local].pg++; stats[m.local].pts += 3; stats[m.visita].pp++ }
      else if (res === '2') { stats[m.visita].pg++; stats[m.visita].pts += 3; stats[m.local].pp++ }
      else { stats[m.local].pe++; stats[m.local].pts++; stats[m.visita].pe++; stats[m.visita].pts++ }
    }
    for (const s of Object.values(stats)) s.dg = s.gf - s.gc
    grupos[g] = Object.values(stats).sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf)
  }
  return grupos
}

export function clasificar(tablas) {
  const primeros = []
  const segundos = []
  const terceros = []
  for (const g of GRUPOS) {
    const t = tablas[g]
    if (t.length < 4) { primeros.push(null); segundos.push(null); terceros.push(null); continue }
    primeros.push(t[0].equipo)
    segundos.push(t[1].equipo)
    terceros.push(t[2])
  }
  const tercerosRanked = terceros.filter(Boolean).sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf)
  const mejoresTerceros = tercerosRanked.slice(0, 8)
  const tercerosSet = new Set(mejoresTerceros.map(t => t.equipo))

  return {
    primeros: Object.fromEntries(GRUPOS.map((g, i) => [g, primeros[i]])),
    segundos: Object.fromEntries(GRUPOS.map((g, i) => [g, segundos[i]])),
    terceros: Object.fromEntries(GRUPOS.map((g, i) => [g, terceros[i]?.equipo || null])),
    mejoresTerceros: tercerosSet,
    tercerosRanking: mejoresTerceros,
  }
}

function getEquipo(grupo, tipo, clasificados) {
  if (tipo === '1') return clasificados.primeros[grupo]
  if (tipo === '2') return clasificados.segundos[grupo]
  return null
}

function pickTercero(teams, ranking, used) {
  for (const t of ranking) {
    if (teams.includes(t.equipo) && !used.has(t.equipo)) return t.equipo
  }
  return null
}

export function generarEmparejamientos(clasificados) {
  const emparejamientos = []

  // Fixed matches 1-12
  for (const f of FIJOS) {
    const local = getEquipo(f.local.grupo, f.local.tipo, clasificados)
    const visita = getEquipo(f.visita.grupo, f.visita.tipo, clasificados)
    emparejamientos.push({ partido_id: `r32-${f.n}`, local, visita })
  }

  // Third-place matches 13-16
  const used = new Set()
  for (const t of TERCEROS) {
    const local = pickTercero(t.local, clasificados.tercerosRanking, used)
    if (local) used.add(local)
    const visita = pickTercero(t.visita, clasificados.tercerosRanking, used)
    if (visita) used.add(visita)
    emparejamientos.push({ partido_id: `r32-${t.n}`, local, visita })
  }

  return emparejamientos
}

export function generarR32(partidos) {
  const tablas = calcularTablasGrupos(partidos)
  const clasificados = clasificar(tablas)
  return generarEmparejamientos(clasificados)
}
