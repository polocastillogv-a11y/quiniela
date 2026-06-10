import { equipos } from './equipos'

const letras = ['A','B','C','D','E','F','G','H','I','J','K','L']
export const gruposLetras = letras

export const grupos = gruposLetras.map(letra => ({
  id: letra,
  nombre: `Grupo ${letra}`,
  equipos: equipos.filter(e => e.grupo === letra).map(e => e.id),
}))

export const getEquiposDelGrupo = (letra) =>
  equipos.filter(e => e.grupo === letra)

export const getEquipo = (id) =>
  equipos.find(e => e.id === id)


