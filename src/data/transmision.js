const GROUP_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L']

const GROUP_MATCHES = [
  { id:1, group:"A", date:"2026-06-11", time:"13:00", home:"México", away:"Sudáfrica", stadium:"Estadio CDMX", city:"Ciudad de México", freeTV:["Azteca 7","Canal 5","Las Estrellas"] },
  { id:2, group:"A", date:"2026-06-11", time:"20:00", home:"Corea del Sur", away:"Chequia", stadium:"Estadio Akron", city:"Guadalajara", freeTV:[] },
  { id:3, group:"A", date:"2026-06-18", time:"19:00", home:"México", away:"Corea del Sur", stadium:"Estadio Akron", city:"Guadalajara", freeTV:["Azteca 7","Canal 5"] },
  { id:4, group:"A", date:"2026-06-18", time:"12:00", home:"Sudáfrica", away:"Chequia", stadium:"Mercedes-Benz Stadium", city:"Atlanta", freeTV:[] },
  { id:5, group:"A", date:"2026-06-24", time:"19:00", home:"Chequia", away:"México", stadium:"Estadio CDMX", city:"Ciudad de México", freeTV:["Azteca 7","Canal 5"] },
  { id:6, group:"A", date:"2026-06-24", time:"19:00", home:"Sudáfrica", away:"Corea del Sur", stadium:"Estadio BBVA", city:"Monterrey", freeTV:[] },
  { id:7, group:"B", date:"2026-06-12", time:"15:00", home:"Canadá", away:"Bosnia", stadium:"BMO Field", city:"Toronto", freeTV:[] },
  { id:8, group:"B", date:"2026-06-13", time:"12:00", home:"Catar", away:"Suiza", stadium:"Levi's Stadium", city:"Santa Clara", freeTV:[] },
  { id:9, group:"B", date:"2026-06-18", time:"15:00", home:"Canadá", away:"Catar", stadium:"BC Place", city:"Vancouver", freeTV:[] },
  { id:10, group:"B", date:"2026-06-18", time:"12:00", home:"Bosnia", away:"Suiza", stadium:"SoFi Stadium", city:"Los Ángeles", freeTV:[] },
  { id:11, group:"B", date:"2026-06-24", time:"12:00", home:"Suiza", away:"Canadá", stadium:"BC Place", city:"Vancouver", freeTV:[] },
  { id:12, group:"B", date:"2026-06-24", time:"12:00", home:"Bosnia", away:"Catar", stadium:"Lumen Field", city:"Seattle", freeTV:[] },
  { id:13, group:"C", date:"2026-06-13", time:"18:00", home:"Brasil", away:"Marruecos", stadium:"MetLife Stadium", city:"Nueva York/NJ", freeTV:["Azteca 7","Canal 5"] },
  { id:14, group:"C", date:"2026-06-13", time:"21:00", home:"Haití", away:"Escocia", stadium:"Gillette Stadium", city:"Boston", freeTV:[] },
  { id:15, group:"C", date:"2026-06-19", time:"20:30", home:"Brasil", away:"Haití", stadium:"Lincoln Financial Field", city:"Filadelfia", freeTV:["Azteca 7"] },
  { id:16, group:"C", date:"2026-06-19", time:"18:00", home:"Marruecos", away:"Escocia", stadium:"Gillette Stadium", city:"Boston", freeTV:[] },
  { id:17, group:"C", date:"2026-06-24", time:"18:00", home:"Escocia", away:"Brasil", stadium:"Hard Rock Stadium", city:"Miami", freeTV:[] },
  { id:18, group:"C", date:"2026-06-24", time:"18:00", home:"Marruecos", away:"Haití", stadium:"Mercedes-Benz Stadium", city:"Atlanta", freeTV:[] },
  { id:19, group:"D", date:"2026-06-12", time:"18:00", home:"EE.UU.", away:"Paraguay", stadium:"SoFi Stadium", city:"Los Ángeles", freeTV:[] },
  { id:20, group:"D", date:"2026-06-13", time:"21:00", home:"Australia", away:"Türkiye", stadium:"BC Place", city:"Vancouver", freeTV:[] },
  { id:21, group:"D", date:"2026-06-19", time:"12:00", home:"EE.UU.", away:"Australia", stadium:"Lumen Field", city:"Seattle", freeTV:[] },
  { id:22, group:"D", date:"2026-06-19", time:"20:00", home:"Paraguay", away:"Türkiye", stadium:"Levi's Stadium", city:"Santa Clara", freeTV:[] },
  { id:23, group:"D", date:"2026-06-25", time:"19:00", home:"Türkiye", away:"EE.UU.", stadium:"SoFi Stadium", city:"Los Ángeles", freeTV:[] },
  { id:24, group:"D", date:"2026-06-25", time:"19:00", home:"Paraguay", away:"Australia", stadium:"Levi's Stadium", city:"Santa Clara", freeTV:[] },
  { id:25, group:"E", date:"2026-06-14", time:"12:00", home:"Alemania", away:"Curazao", stadium:"NRG Stadium", city:"Houston", freeTV:[] },
  { id:26, group:"E", date:"2026-06-14", time:"19:00", home:"Costa de Marfil", away:"Ecuador", stadium:"Lincoln Financial Field", city:"Filadelfia", freeTV:[] },
  { id:27, group:"E", date:"2026-06-20", time:"16:00", home:"Alemania", away:"Costa de Marfil", stadium:"BMO Field", city:"Toronto", freeTV:[] },
  { id:28, group:"E", date:"2026-06-20", time:"19:00", home:"Curazao", away:"Ecuador", stadium:"Arrowhead Stadium", city:"Kansas City", freeTV:[] },
  { id:29, group:"E", date:"2026-06-25", time:"16:00", home:"Ecuador", away:"Alemania", stadium:"MetLife Stadium", city:"Nueva York/NJ", freeTV:["Azteca 7","Canal 5"] },
  { id:30, group:"E", date:"2026-06-25", time:"16:00", home:"Curazao", away:"Costa de Marfil", stadium:"Lincoln Financial Field", city:"Filadelfia", freeTV:[] },
  { id:31, group:"F", date:"2026-06-14", time:"15:00", home:"Países Bajos", away:"Japón", stadium:"AT&T Stadium", city:"Arlington TX", freeTV:["Azteca 7","Canal 5"] },
  { id:32, group:"F", date:"2026-06-14", time:"20:00", home:"Suecia", away:"Túnez", stadium:"Estadio BBVA", city:"Monterrey", freeTV:[] },
  { id:33, group:"F", date:"2026-06-20", time:"12:00", home:"Países Bajos", away:"Suecia", stadium:"NRG Stadium", city:"Houston", freeTV:["Azteca 7"] },
  { id:34, group:"F", date:"2026-06-20", time:"22:00", home:"Japón", away:"Túnez", stadium:"Estadio BBVA", city:"Monterrey", freeTV:[] },
  { id:35, group:"F", date:"2026-06-25", time:"18:00", home:"Túnez", away:"Países Bajos", stadium:"Arrowhead Stadium", city:"Kansas City", freeTV:[] },
  { id:36, group:"F", date:"2026-06-25", time:"18:00", home:"Japón", away:"Suecia", stadium:"AT&T Stadium", city:"Arlington TX", freeTV:[] },
  { id:37, group:"G", date:"2026-06-15", time:"12:00", home:"Bélgica", away:"Egipto", stadium:"Lumen Field", city:"Seattle", freeTV:[] },
  { id:38, group:"G", date:"2026-06-15", time:"18:00", home:"Irán", away:"Nueva Zelanda", stadium:"SoFi Stadium", city:"Los Ángeles", freeTV:[] },
  { id:39, group:"G", date:"2026-06-21", time:"12:00", home:"Bélgica", away:"Irán", stadium:"SoFi Stadium", city:"Los Ángeles", freeTV:[] },
  { id:40, group:"G", date:"2026-06-21", time:"18:00", home:"Egipto", away:"Nueva Zelanda", stadium:"BC Place", city:"Vancouver", freeTV:[] },
  { id:41, group:"G", date:"2026-06-26", time:"20:00", home:"Nueva Zelanda", away:"Bélgica", stadium:"BC Place", city:"Vancouver", freeTV:[] },
  { id:42, group:"G", date:"2026-06-26", time:"20:00", home:"Egipto", away:"Irán", stadium:"Lumen Field", city:"Seattle", freeTV:[] },
  { id:43, group:"H", date:"2026-06-15", time:"12:00", home:"España", away:"Cabo Verde", stadium:"Mercedes-Benz Stadium", city:"Atlanta", freeTV:[] },
  { id:44, group:"H", date:"2026-06-15", time:"18:00", home:"Arabia Saudita", away:"Uruguay", stadium:"Hard Rock Stadium", city:"Miami", freeTV:[] },
  { id:45, group:"H", date:"2026-06-21", time:"12:00", home:"España", away:"Arabia Saudita", stadium:"Mercedes-Benz Stadium", city:"Atlanta", freeTV:["Azteca 7","Canal 5"] },
  { id:46, group:"H", date:"2026-06-21", time:"18:00", home:"Cabo Verde", away:"Uruguay", stadium:"Hard Rock Stadium", city:"Miami", freeTV:[] },
  { id:47, group:"H", date:"2026-06-26", time:"18:00", home:"Uruguay", away:"España", stadium:"Estadio Akron", city:"Guadalajara", freeTV:[] },
  { id:48, group:"H", date:"2026-06-26", time:"19:00", home:"Cabo Verde", away:"Arabia Saudita", stadium:"NRG Stadium", city:"Houston", freeTV:["Azteca 7","Canal 5"] },
  { id:49, group:"I", date:"2026-06-16", time:"15:00", home:"Francia", away:"Senegal", stadium:"MetLife Stadium", city:"Nueva York/NJ", freeTV:[] },
  { id:50, group:"I", date:"2026-06-16", time:"18:00", home:"Irak", away:"Noruega", stadium:"Gillette Stadium", city:"Boston", freeTV:[] },
  { id:51, group:"I", date:"2026-06-22", time:"17:00", home:"Francia", away:"Irak", stadium:"Lincoln Financial Field", city:"Filadelfia", freeTV:[] },
  { id:52, group:"I", date:"2026-06-22", time:"20:00", home:"Senegal", away:"Noruega", stadium:"MetLife Stadium", city:"Nueva York/NJ", freeTV:["Azteca 7","Canal 5"] },
  { id:53, group:"I", date:"2026-06-26", time:"15:00", home:"Noruega", away:"Francia", stadium:"Gillette Stadium", city:"Boston", freeTV:[] },
  { id:54, group:"I", date:"2026-06-26", time:"15:00", home:"Senegal", away:"Irak", stadium:"BMO Field", city:"Toronto", freeTV:[] },
  { id:55, group:"J", date:"2026-06-16", time:"20:00", home:"Argentina", away:"Argelia", stadium:"Arrowhead Stadium", city:"Kansas City", freeTV:["Azteca 7","Canal 5"] },
  { id:56, group:"J", date:"2026-06-16", time:"21:00", home:"Austria", away:"Jordania", stadium:"Levi's Stadium", city:"Santa Clara", freeTV:[] },
  { id:57, group:"J", date:"2026-06-22", time:"12:00", home:"Argentina", away:"Austria", stadium:"AT&T Stadium", city:"Arlington TX", freeTV:[] },
  { id:58, group:"J", date:"2026-06-22", time:"20:00", home:"Argelia", away:"Jordania", stadium:"Levi's Stadium", city:"Santa Clara", freeTV:[] },
  { id:59, group:"J", date:"2026-06-27", time:"21:00", home:"Jordania", away:"Argentina", stadium:"AT&T Stadium", city:"Arlington TX", freeTV:[] },
  { id:60, group:"J", date:"2026-06-27", time:"21:00", home:"Argelia", away:"Austria", stadium:"Arrowhead Stadium", city:"Kansas City", freeTV:[] },
  { id:61, group:"K", date:"2026-06-17", time:"12:00", home:"Portugal", away:"RD Congo", stadium:"NRG Stadium", city:"Houston", freeTV:[] },
  { id:62, group:"K", date:"2026-06-17", time:"20:00", home:"Uzbekistán", away:"Colombia", stadium:"Estadio CDMX", city:"Ciudad de México", freeTV:[] },
  { id:63, group:"K", date:"2026-06-23", time:"12:00", home:"Portugal", away:"Uzbekistán", stadium:"NRG Stadium", city:"Houston", freeTV:["Azteca 7","Canal 5"] },
  { id:64, group:"K", date:"2026-06-23", time:"20:00", home:"RD Congo", away:"Colombia", stadium:"Estadio Akron", city:"Guadalajara", freeTV:[] },
  { id:65, group:"K", date:"2026-06-27", time:"19:30", home:"Colombia", away:"Portugal", stadium:"Hard Rock Stadium", city:"Miami", freeTV:["Azteca 7","Canal 5"] },
  { id:66, group:"K", date:"2026-06-27", time:"19:30", home:"RD Congo", away:"Uzbekistán", stadium:"Mercedes-Benz Stadium", city:"Atlanta", freeTV:[] },
  { id:67, group:"L", date:"2026-06-17", time:"15:00", home:"Inglaterra", away:"Croacia", stadium:"AT&T Stadium", city:"Arlington TX", freeTV:["Azteca 7","Canal 5"] },
  { id:68, group:"L", date:"2026-06-17", time:"19:00", home:"Ghana", away:"Panamá", stadium:"BMO Field", city:"Toronto", freeTV:[] },
  { id:69, group:"L", date:"2026-06-23", time:"16:00", home:"Inglaterra", away:"Ghana", stadium:"Gillette Stadium", city:"Boston", freeTV:[] },
  { id:70, group:"L", date:"2026-06-23", time:"19:00", home:"Croacia", away:"Panamá", stadium:"BMO Field", city:"Toronto", freeTV:[] },
  { id:71, group:"L", date:"2026-06-27", time:"17:00", home:"Panamá", away:"Inglaterra", stadium:"MetLife Stadium", city:"Nueva York/NJ", freeTV:["Azteca 7","Canal 5"] },
  { id:72, group:"L", date:"2026-06-27", time:"17:00", home:"Croacia", away:"Ghana", stadium:"Lincoln Financial Field", city:"Filadelfia", freeTV:[] },
]

// Build lookup: each match's key is g-{group}-{globalId}
// where globalId = groupIndex * 6 + matchSequence (matching partidos.js IDs)
const lookup = {}

GROUP_MATCHES.forEach(m => {
  const gIdx = GROUP_LETTERS.indexOf(m.group)
  const matchIdx = (m.id - 1) % 6
  const globalId = gIdx * 6 + matchIdx + 1
  const key = `g-${m.group}-${globalId}`
  lookup[key] = { stadium: m.stadium, city: m.city, time: m.time, date: m.date, freeTV: m.freeTV }
})

const ELIM_MATCHES = [
  // RONDA DE 32 (Jun 28 - Jul 3)
  { id:"r32-1", date:"2026-06-28", time:"12:00", stadium:"SoFi Stadium", city:"Los Ángeles", freeTV:["Azteca 7","Canal 5"] },
  { id:"r32-2", date:"2026-06-29", time:"16:30", stadium:"Gillette Stadium", city:"Boston", freeTV:[] },
  { id:"r32-3", date:"2026-06-29", time:"19:00", stadium:"Estadio BBVA", city:"Monterrey", freeTV:[] },
  { id:"r32-4", date:"2026-06-29", time:"12:00", stadium:"NRG Stadium", city:"Houston", freeTV:[] },
  { id:"r32-5", date:"2026-06-30", time:"17:00", stadium:"MetLife Stadium", city:"Nueva York/NJ", freeTV:["Azteca 7","Canal 5"] },
  { id:"r32-6", date:"2026-06-30", time:"12:00", stadium:"AT&T Stadium", city:"Arlington TX", freeTV:[] },
  { id:"r32-7", date:"2026-06-30", time:"19:00", stadium:"Estadio CDMX", city:"Ciudad de México", freeTV:[] },
  { id:"r32-8", date:"2026-07-01", time:"12:00", stadium:"Mercedes-Benz Stadium", city:"Atlanta", freeTV:[] },
  { id:"r32-9", date:"2026-07-01", time:"17:00", stadium:"Levi's Stadium", city:"Santa Clara", freeTV:[] },
  { id:"r32-10", date:"2026-07-01", time:"13:00", stadium:"Lumen Field", city:"Seattle", freeTV:[] },
  { id:"r32-11", date:"2026-07-02", time:"19:00", stadium:"BMO Field", city:"Toronto", freeTV:[] },
  { id:"r32-12", date:"2026-07-02", time:"12:00", stadium:"SoFi Stadium", city:"Los Ángeles", freeTV:[] },
  { id:"r32-13", date:"2026-07-02", time:"20:00", stadium:"BC Place", city:"Vancouver", freeTV:[] },
  { id:"r32-14", date:"2026-07-03", time:"18:00", stadium:"Hard Rock Stadium", city:"Miami", freeTV:[] },
  { id:"r32-15", date:"2026-07-03", time:"20:30", stadium:"Arrowhead Stadium", city:"Kansas City", freeTV:[] },
  { id:"r32-16", date:"2026-07-03", time:"13:00", stadium:"AT&T Stadium", city:"Arlington TX", freeTV:[] },
  // OCTAVOS DE FINAL (Jul 4-7)
  { id:"r16-1", date:"2026-07-04", time:"17:00", stadium:"Lincoln Financial Field", city:"Filadelfia", freeTV:["Azteca 7","Canal 5"] },
  { id:"r16-2", date:"2026-07-04", time:"12:00", stadium:"NRG Stadium", city:"Houston", freeTV:[] },
  { id:"r16-3", date:"2026-07-05", time:"16:00", stadium:"MetLife Stadium", city:"Nueva York/NJ", freeTV:[] },
  { id:"r16-4", date:"2026-07-05", time:"18:00", stadium:"Estadio CDMX", city:"Ciudad de México", freeTV:["Azteca 7","Canal 5"] },
  { id:"r16-5", date:"2026-07-06", time:"14:00", stadium:"AT&T Stadium", city:"Arlington TX", freeTV:[] },
  { id:"r16-6", date:"2026-07-06", time:"17:00", stadium:"Lumen Field", city:"Seattle", freeTV:[] },
  { id:"r16-7", date:"2026-07-07", time:"12:00", stadium:"Mercedes-Benz Stadium", city:"Atlanta", freeTV:[] },
  { id:"r16-8", date:"2026-07-07", time:"13:00", stadium:"BC Place", city:"Vancouver", freeTV:[] },
  // CUARTOS DE FINAL (Jul 9-11)
  { id:"cf-1", date:"2026-07-09", time:"16:00", stadium:"Gillette Stadium", city:"Boston", freeTV:["Azteca 7","Canal 5"] },
  { id:"cf-2", date:"2026-07-10", time:"12:00", stadium:"SoFi Stadium", city:"Los Ángeles", freeTV:[] },
  { id:"cf-3", date:"2026-07-11", time:"17:00", stadium:"Hard Rock Stadium", city:"Miami", freeTV:[] },
  { id:"cf-4", date:"2026-07-11", time:"20:00", stadium:"Arrowhead Stadium", city:"Kansas City", freeTV:["Azteca 7","Canal 5"] },
  // SEMIFINALES (Jul 14-15)
  { id:"sf-1", date:"2026-07-14", time:"14:00", stadium:"AT&T Stadium", city:"Arlington TX", freeTV:["Azteca 7","Canal 5","Las Estrellas"] },
  { id:"sf-2", date:"2026-07-15", time:"15:00", stadium:"Mercedes-Benz Stadium", city:"Atlanta", freeTV:["Azteca 7","Canal 5","Las Estrellas"] },
  // TERCER LUGAR
  { id:"tp-1", date:"2026-07-18", time:"17:00", stadium:"Hard Rock Stadium", city:"Miami", freeTV:["Azteca 7","Canal 5"] },
  // FINAL
  { id:"fn-1", date:"2026-07-19", time:"15:00", stadium:"MetLife Stadium", city:"Nueva York/NJ", freeTV:["Azteca 7","Canal 5","Las Estrellas"] },
]

ELIM_MATCHES.forEach(m => {
  lookup[m.id] = { stadium: m.stadium, city: m.city, time: m.time, date: m.date, freeTV: m.freeTV }
})

export const transmision = lookup

export function getTransmision(partidoId) {
  return lookup[partidoId] || null
}