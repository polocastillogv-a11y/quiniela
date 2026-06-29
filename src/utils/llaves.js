import { equipos } from '../data/equipos'

const GRUPOS = ['A','B','C','D','E','F','G','H','I','J','K','L']

// FIFA Official R32 pairings (Match IDs 73-88)
const R32_PAIRINGS = [
  { n: 1,  local: { tipo: '2', grupo: 'A' }, visita: { tipo: '2', grupo: 'B' } },
  { n: 2,  local: { tipo: '1', grupo: 'E' }, visita: { tipo: '3', pools: ['A','B','C','D','F'] } },
  { n: 3,  local: { tipo: '1', grupo: 'F' }, visita: { tipo: '2', grupo: 'C' } },
  { n: 4,  local: { tipo: '1', grupo: 'C' }, visita: { tipo: '2', grupo: 'F' } },
  { n: 5,  local: { tipo: '1', grupo: 'I' }, visita: { tipo: '3', pools: ['C','D','F','G','H'] } },
  { n: 6,  local: { tipo: '2', grupo: 'E' }, visita: { tipo: '2', grupo: 'I' } },
  { n: 7,  local: { tipo: '1', grupo: 'A' }, visita: { tipo: '3', pools: ['C','E','F','H','I'] } },
  { n: 8,  local: { tipo: '1', grupo: 'L' }, visita: { tipo: '3', pools: ['E','H','I','J','K'] } },
  { n: 9,  local: { tipo: '1', grupo: 'D' }, visita: { tipo: '3', pools: ['B','E','F','I','J'] } },
  { n: 10, local: { tipo: '1', grupo: 'G' }, visita: { tipo: '3', pools: ['A','E','H','I','J'] } },
  { n: 11, local: { tipo: '2', grupo: 'K' }, visita: { tipo: '2', grupo: 'L' } },
  { n: 12, local: { tipo: '1', grupo: 'H' }, visita: { tipo: '2', grupo: 'J' } },
  { n: 13, local: { tipo: '1', grupo: 'B' }, visita: { tipo: '3', pools: ['E','F','G','I','J'] } },
  { n: 14, local: { tipo: '1', grupo: 'J' }, visita: { tipo: '2', grupo: 'H' } },
  { n: 15, local: { tipo: '1', grupo: 'K' }, visita: { tipo: '3', pools: ['D','E','I','J','L'] } },
  { n: 16, local: { tipo: '2', grupo: 'D' }, visita: { tipo: '2', grupo: 'G' } },
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

// Todos los 32avos ya definidos por la FIFA (datos reales del torneo)
const CONFIRMADOS = {
  'r32-1':  { local: 'RSA', visita: 'CAN' },
  'r32-2':  { local: 'GER', visita: 'PAR' },
  'r32-3':  { local: 'NED', visita: 'MAR' },
  'r32-4':  { local: 'BRA', visita: 'JPN' },
  'r32-5':  { local: 'FRA', visita: 'SWE' },
  'r32-6':  { local: 'CIV', visita: 'NOR' },
  'r32-7':  { local: 'MEX', visita: 'ECU' },
  'r32-8':  { local: 'ENG', visita: 'COD' },
  'r32-9':  { local: 'USA', visita: 'BIH' },
  'r32-10': { local: 'BEL', visita: 'SEN' },
  'r32-11': { local: 'POR', visita: 'CRO' },
  'r32-12': { local: 'ESP', visita: 'AUT' },
  'r32-13': { local: 'SUI', visita: 'ALG' },
  'r32-14': { local: 'ARG', visita: 'CPV' },
  'r32-15': { local: 'COL', visita: 'GHA' },
  'r32-16': { local: 'AUS', visita: 'EGY' },
}

function getEquipo(grupo, tipo, clasificados) {
  if (tipo === '1') return clasificados.primeros[grupo]
  if (tipo === '2') return clasificados.segundos[grupo]
  return null
}

function getEquipoGrupo(teamId) {
  const eq = equipos.find(e => e.id === teamId)
  return eq ? eq.grupo : null
}

function pickTercero(pools, ranking, used) {
  for (const t of ranking) {
    const grupo = getEquipoGrupo(t.equipo)
    if (grupo && pools.includes(grupo) && !used.has(t.equipo)) return t.equipo
  }
  return null
}

export function generarEmparejamientos(clasificados) {
  const emparejamientos = []
  const used = new Set()

  for (const p of R32_PAIRINGS) {
    let local = null
    let visita = null

    if (p.local.tipo === '3') {
      local = pickTercero(p.local.pools, clasificados.tercerosRanking, used)
      if (local) used.add(local)
    } else {
      local = getEquipo(p.local.grupo, p.local.tipo, clasificados)
    }

    if (p.visita.tipo === '3') {
      visita = pickTercero(p.visita.pools, clasificados.tercerosRanking, used)
      if (visita) used.add(visita)
    } else {
      visita = getEquipo(p.visita.grupo, p.visita.tipo, clasificados)
    }

    emparejamientos.push({ partido_id: `r32-${p.n}`, local, visita })
  }

  // Sobreescribir con equipos confirmados por la FIFA
  for (const e of emparejamientos) {
    const c = CONFIRMADOS[e.partido_id]
    if (c) {
      if (c.local) e.local = c.local
      if (c.visita) e.visita = c.visita
    }
  }

  return emparejamientos
}

export function generarR32(partidos) {
  const tablas = calcularTablasGrupos(partidos)
  const clasificados = clasificar(tablas)
  return generarEmparejamientos(clasificados)
}
