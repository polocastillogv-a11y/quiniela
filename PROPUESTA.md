# 🏆 Quiniela Mundialista — Propuesta de Aplicación

## 1. Visión General

Aplicación web moderna para gestionar una **quiniela del Mundial de Fútbol**, combinando:

- **Módulo de Pronósticos** — cada participante predice resultados (1, X, 2 o marcador exacto)
- **Módulo de Sorteo de Equipos** — se asignan equipos aleatoriamente a cada participante y ganan puntos según el rendimiento de sus equipos

---

## 2. Modalidades

### Modalidad A: Pronóstico Clásico
Cada participante llena su quiniela con pronósticos para todos los partidos. Se asigna puntaje por:
- **1 punto** por resultado correcto (1/X/2) en fase de grupos
- **3 puntos** por marcador exacto en fase de grupos
- Puntaje escalonado en fases eliminatorias (2/4/8/16/32 pts)
- **Bono extra** por acertar campeón, goleador, etc.

### Modalidad B: Sorteo de Equipos (la que solicitaste)
A cada participante se le asignan **equipos aleatoriamente** (entre 2 y 4 equipos por persona, según cantidad de participantes).

Ganan puntos basados en el desempeño **real** de sus equipos:
- **Victoria en grupos:** 3 pts
- **Empate en grupos:** 1 pt
- **Clasificar a Octavos:** +5 pts
- **Clasificar a Cuartos:** +8 pts
- **Clasificar a Semis:** +12 pts
- **Clasificar a Final:** +15 pts
- **Ser Campeón:** +20 pts
- **Goleador/Título individual:** +5 pts

**Total disponible por equipo:** ~64 pts → por 3 equipos ~192 pts posibles por persona.

---

## 3. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | **React 18 + Vite** |
| Estilos | **Tailwind CSS 3** |
| Estado global | **Zustand** (liviano y simple) |
| Enrutamiento | **React Router v6** |
| Almacenamiento | **LocalStorage + JSON** (sin backend — bootstrapping rápido) |
| Persistencia futura | Preparado para migrar a **Supabase** (PostgreSQL) |
| UI Components | **Headless UI** (combobox, dialog, menú) |
| Gráficos/Brackets | **React Bracket** o canvas custom |

---

## 4. Estructura de Carpetas

```
quiniela/
├── public/
│   └── equipos/          # Escudos de selecciones (SVG/PNG)
├── src/
│   ├── components/
│   │   ├── layout/       # Navbar, Sidebar, Footer
│   │   ├── bracket/      # Visualización del bracket eliminatorio
│   │   ├── equipos/      # Escudos, listas, selector de equipos
│   │   ├── participantes/ # CRUD de participantes
│   │   ├── quiniela/     # Tabla de pronósticos, scoring
│   │   ├── sorteo/       # Lógica y UI del sorteo aleatorio
│   │   └── ui/           # Botones, inputs, modales reutilizables
│   ├── data/
│   │   ├── equipos.js    # Lista de 48 selecciones (o las clasificadas)
│   │   ├── grupos.js     # Configuración de grupos A-H
│   │   └── partidos.js   # Calendario de partidos
│   ├── store/
│   │   ├── participantesStore.js
│   │   ├── quinielaStore.js
│   │   └── sorteoStore.js
│   ├── utils/
│   │   ├── puntuacion.js # Lógica de puntuación
│   │   ├── sorteo.js     # Algoritmo de asignación aleatoria
│   │   └── exportar.js   # Exportar a CSV/PDF
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Participantes.jsx
│   │   ├── Sorteo.jsx
│   │   ├── Quiniela.jsx
│   │   ├── Bolsa.jsx
│   │   ├── Bracket.jsx
│   │   └── Resultados.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 5. Pantallas (Vistas)

### 5.1 Dashboard (`/`)
- Resumen general: total de participantes, bolsa acumulada, top 3
- Gráfica de evolución de puntajes
- Enlaces rápidos a cada sección

### 5.2 Participantes (`/participantes`)
- **Lista** con tabla: nombre, equipos asignados, monto aportado, pagó ✅/❌
- **Formulario** para agregar/editar participante
- **Control de pagos**: toggle pagado/no pagado + monto
- **Bolsa total** calculada automáticamente

### 5.3 Sorteo de Equipos (`/sorteo`)
- Botón **"Realizar Sorteo"** que asigna equipos aleatoriamente
- Vista de resultados del sorteo: tarjetas por participante con sus equipos
- Validación: no repetir equipos entre participantes
- Opción de re-sorteo (solo si no hay partidos jugados)

### 5.4 Quiniela / Pronósticos (`/quiniela`)
- Tabla con todos los partidos del mundial agrupados por jornada/fase
- Inputs para que cada participante registre sus pronósticos
- Vista comparativa: lado a lado entre participantes
- Puntaje parcial en vivo

### 5.5 Bolsa / Pagos (`/bolsa`)
- Resumen económico: total recaudado, desglose por participante
- Marcador de pagos con color (verde = pagado, rojo = pendiente)
- Botón para marcar pago individual o masivo
- Cálculos automáticos: fondo total, fondo restante por cobrar

### 5.6 Bracket Eliminatorio (`/bracket`)
- Visualización gráfica del bracket (octavos → final)
- Pronósticos de cada participante sobrepuestos
- Resultados reales vs pronósticos

### 5.7 Resultados / Tabla de Posiciones (`/resultados`)
- Ranking general de participantes con puntaje acumulado
- Desglose por fase (grupos, octavos, cuartos, etc.)
- Historial de puntuación por jornada

---

## 6. Flujo de Sorteo Aleatorio (Modalidad B)

```
1. Registrar N participantes
2. Definir cuota por persona (ej: $100 MXN)
3. Presionar "Realizar Sorteo"
4. Algoritmo:
   a. Tomar lista de 32 (o 48) equipos
   b. Barajar (Fisher-Yates shuffle)
   c. Distribuir equitativamente entre participantes
   d. Si sobran equipos, asignar aleatoriamente (round-robin)
5. Mostrar resultado en tarjetas
6. Cada participante ve qué equipos le tocaron
```

### Distribución sugerida por cantidad de participantes:

| Participantes | Equipos por persona |
|--------------|-------------------|
| 4 | 8 equipos c/u |
| 8 | 4 equipos c/u |
| 12 | 2-3 equipos c/u |
| 16 | 2 equipos c/u |

---

## 7. Gestión de Pagos y Bolsa

```
Participante {
  id, nombre, email (opcional),
  cuota: number,           // lo que debe pagar
  pagado: boolean,
  fecha_pago: Date | null,
  metodo_pago: "efectivo" | "transferencia" | "depósito",
  referencia_pago: string  // número de comprobante
}

Bolsa {
  total_esperado: number,  // participantes × cuota
  total_recaudado: number, // suma de pagos confirmados
  pendiente: number,       // total_esperado - total_recaudado
  porcentaje_cobrado: number
}
```

---

## 8. Scoring System Detallado

### Para la Modalidad B (Sorteo de Equipos):

| Evento | Puntos |
|--------|--------|
| Victoria en fase de grupos | +3 |
| Empate en fase de grupos | +1 |
| Clasificar a Octavos de Final | +5 |
| Ganar en Octavos (pasar a Cuartos) | +4 |
| Ganar en Cuartos (pasar a Semis) | +6 |
| Ganar en Semis (pasar a Final) | +8 |
| Ganar la Final (Campeón) | +10 |
| Perder la Final (Subcampeón) | +3 |
| Ganar el 3er lugar | +2 |
| **Bonus: Goleador del Mundial** | +5 |
| **Bonus: Mejor Jugador** | +3 |

**Puntaje máximo posible por equipo:** 3 (victoria) × 3 (grupos) + 1 (empate opcional) + 5 + 4 + 6 + 8 + 10 = ~43 pts por equipo + bonus

---

## 9. Posibles Mejoras Futuras

- [ ] Persistencia en Supabase (base de datos real)
- [ ] Autenticación con Google / email
- [ ] Notificaciones por WhatsApp/email cuando alguien paga
- [ ] Vista pública para que los participantes vean resultados sin login
- [ ] Exportar resultados a PDF/CSV
- [ ] Modo oscuro
- [ ] Soporte multi-mundial (2026, 2030, etc.)
- [ ] App móvil con PWA

---

## 10. Plan de Implementación

### Fase 1 — MVP (Sorteo + Pagos)
1. Scaffolding del proyecto (Vite + React + Tailwind)
2. CRUD de participantes
3. Sorteo aleatorio de equipos
4. Gestión de pagos y cálculo de bolsa
5. Tabla de posiciones básica

### Fase 2 — Pronósticos
6. Catálogo de partidos
7. Registro de pronósticos
8. Cálculo de puntuación automático
9. Bracket visual

### Fase 3 — UX + Extras
10. Diseño responsive
11. Exportación de datos
12. Dashboard con gráficas

---

## 📐 Diseño Visual (mockups conceptuales)

### Dashboard
```
┌─────────────────────────────────────────────────┐
│  🏆 Quiniela Mundial 2026        [Participantes] │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │ Participantes│ │  Bolsa Total │ │  Top 3     │ │
│  │     12      │ │   $12,000   │ │  1. Juan   │ │
│  └─────────────┘ └─────────────┘ └────────────┘ │
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │  Tabla de Posiciones                        ││
│  │  # │ Participante │ Pts │ Equipos │ Pagó   ││
│  │  1 │ Juan P.      │ 45  │ 🇦🇷🇧🇷🇫🇷   │ ✅    ││
│  │  2 │ María G.     │ 38  │ 🇩🇪🇪🇸🇵🇹   │ ✅    ││
│  │  3 │ Carlos L.    │ 32  │ 🏴󠁧󠁢󠁥󠁮󠁧󠁿🇳🇱🇧🇪   │ ❌    ││
│  └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

---

## 🙋‍♂️ Preguntas para Definir

Antes de empezar a codificar, necesito saber:

1. **¿Cuál modalidad prefieres o ambas?** — ¿Solo sorteo de equipos, solo pronósticos, o las dos?
2. **¿Cuántos participantes esperas?** — Para definir distribución de equipos
3. **¿Cuota por persona?** — Monto sugerido para la bolsa
4. **¿Idioma?** — ¿App en español o inglés?
5. **¿Mundial específico?** — ¿2026 (48 equipos, 16 grupos de 3) o formato tradicional 32 equipos?

---

¿Te parece bien esta propuesta? Si la apruebas, empezamos con la Fase 1.
