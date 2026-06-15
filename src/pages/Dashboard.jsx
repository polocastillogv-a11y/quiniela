import useParticipantesStore from '../store/participantesStore'
import useQuinielaStore from '../store/quinielaStore'
import useBackgroundStore from '../store/backgroundStore'
import { calcularPuntos } from '../utils/puntuacion'
import { TrophyIcon, UsersIcon, WalletIcon, HourglassIcon, BallIcon, DicesIcon, ClipboardIcon, CoinsIcon, ChartIcon, ChevronRightIcon } from '../components/ui/Icons'
import Sunburst from '../components/ui/Sunburst'

const STATS = [
  { icon: UsersIcon, value: null, label: 'Participantes', sub: 'inscritos', key: 'activos' },
  { icon: WalletIcon, value: null, label: 'Bolsa actual', sub: null, key: 'bolsa', prefix: '$' },
  { icon: HourglassIcon, value: null, label: 'Pendiente de cobro', sub: null, key: 'pendiente', prefix: '$' },
  { icon: BallIcon, value: null, label: 'Partidos jugados', sub: 'grupos', key: 'jugados', suffix: '/104' },
]

const ACCIONES = [
  { icon: UsersIcon, label: 'Gestionar Participantes', desc: 'Altas, bajas y datos', to: '/participantes' },
  { icon: DicesIcon, label: 'Sorteo de Equipos', desc: 'Asignar selecciones', to: '/sorteo' },
  { icon: ClipboardIcon, label: 'Hacer Pronósticos', desc: 'Llenar la quiniela', to: '/quiniela' },
  { icon: CoinsIcon, label: 'Gestionar Pagos', desc: 'Control de la bolsa', to: '/bolsa' },
  { icon: ChartIcon, label: 'Ver Resultados', desc: 'Marcadores y puntos', to: '/resultados' },
]

function StatCard({ icon: Icon, value, label, sub, prefix, suffix, accent }) {
  return (
    <div
      style={{
        background: '#FBF6E6',
        border: '1px solid rgba(22,39,26,.13)',
        borderRadius: 14,
        padding: '18px 18px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 4,
          background: accent || '#1E6B43',
        }}
      />
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'rgba(30,107,67,.10)',
          color: '#1E6B43',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}
      >
        <Icon className="w-[19px] h-[19px]" />
      </div>
      <div className="font-display font-extrabold" style={{ fontSize: 38, lineHeight: .9, color: '#14442B' }}>
        {prefix || ''}{value}{suffix || ''}
      </div>
      <div className="font-sans font-semibold" style={{ fontSize: 13.5, marginTop: 6, color: '#16271A' }}>
        {label}
      </div>
      {sub && (
        <div className="font-mono font-bold" style={{ fontSize: 10.5, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(22,39,26,.5)', marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function AccionRow({ icon: Icon, label, desc, to }) {
  return (
    <a
      href={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '13px 15px',
        border: '1px solid rgba(22,39,26,.12)',
        borderRadius: 11,
        background: '#FFFDF4',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'transform .14s, box-shadow .14s',
      }}
      className="hover:translate-x-[4px] hover:shadow-[0_8px_20px_rgba(22,39,26,.10)]"
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'rgba(20,68,43,.08)',
          color: '#1E6B43',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon className="w-[20px] h-[20px]" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="font-sans font-bold" style={{ fontSize: 15, color: '#16271A' }}>{label}</div>
        <div className="font-sans" style={{ fontSize: 12, color: 'rgba(22,39,26,.55)' }}>{desc}</div>
      </div>
      <ChevronRightIcon className="w-[18px] h-[18px]" style={{ color: 'rgba(22,39,26,.32)', flexShrink: 0 }} />
    </a>
  )
}

export default function Dashboard() {
  const alternate = useBackgroundStore(s => s.alternate)
  const participantes = useParticipantesStore(s => s.participantes)
  const totalBolsa = useParticipantesStore(s => s.totalBolsa)
  const totalEsperado = useParticipantesStore(s => s.totalEsperado)
  const totalPendiente = useParticipantesStore(s => s.totalPendiente)
  const partidos = useQuinielaStore(s => s.partidos)
  const predicciones = useQuinielaStore(s => s.predicciones)

  const activos = participantes.filter(p => p.activo !== false)
  const jugados = partidos.filter(p => p.actualizado).length
  const bolsa = totalBolsa()
  const esperado = totalEsperado()
  const pendiente = totalPendiente()

  const rankings = activos.map(p => {
    const res = calcularPuntos(predicciones, p.id, partidos)
    return { ...p, puntos: res.puntos }
  }).sort((a, b) => b.puntos - a.puntos)

  const medalBg = (i) => {
    if (i === 0) return '#D9A441'
    if (i === 1) return '#C9C4B2'
    if (i === 2) return '#C0845A'
    return 'rgba(30,107,67,.18)'
  }

  const initials = (name) =>
    name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'

  return (
    <div
        className="w-full"
        style={{
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid rgba(22,39,26,.18)',
          boxShadow: '0 22px 50px rgba(22,39,26,.16)',
          position: 'relative',
          ...(alternate ? {} : {
            backgroundImage: 'url(/fondo_mund.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }),
        }}
      >
        <Sunburst />
        <div style={{ background: alternate ? '#EFE6CC' : 'rgba(239, 230, 204, 0.88)', padding: '30px 30px 34px', position: 'relative', zIndex: 1 }}>
        {/* Title row */}
        <div className="flex items-end justify-between" style={{ marginBottom: 24 }}>
          <div>
            <div className="font-mono font-bold" style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: '#1E6B43', marginBottom: 4 }}>
              Temporada 2026 · Torneo abierto
            </div>
            <h1 className="font-display font-black" style={{ fontSize: 46, lineHeight: .9, textTransform: 'uppercase', color: '#14442B' }}>
              Dashboard
            </h1>
          </div>
          <div
            className="font-mono font-bold"
            style={{
              fontSize: 12,
              color: 'rgba(22,39,26,.6)',
              background: '#FBF6E6',
              border: '1px solid rgba(22,39,26,.14)',
              padding: '9px 14px',
              borderRadius: 8,
              whiteSpace: 'nowrap',
            }}
          >
            Fase de grupos · 11 jun
          </div>
        </div>

        {/* 4 stat cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: 16, marginBottom: 24 }}
        >
          <StatCard icon={UsersIcon} value={activos.length} label="Participantes" sub="inscritos" accent="#1E6B43" />
          <StatCard icon={WalletIcon} value={bolsa.toLocaleString()} label="Bolsa actual" sub={`de $${esperado.toLocaleString()}`} prefix="$" accent="#1E6B43" />
          <StatCard icon={HourglassIcon} value={pendiente.toLocaleString()} label="Pendiente de cobro" sub={`${activos.filter(p => !p.pagado).length} pagos`} prefix="$" accent="#b54a3b" />
          <StatCard icon={BallIcon} value={jugados} label="Partidos jugados" sub="grupos" suffix={`/${partidos.length}`} accent="#1E6B43" />
        </div>

        {/* 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 20 }}>
          {/* Acciones rápidas */}
          <div
            style={{
              background: '#FBF6E6',
              border: '1px solid rgba(22,39,26,.13)',
              borderRadius: 14,
              padding: 22,
            }}
          >
            <h2 className="font-display font-extrabold" style={{ fontSize: 22, textTransform: 'uppercase', color: '#16271A', margin: '0 0 16px', whiteSpace: 'nowrap' }}>
              Acciones rápidas
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ACCIONES.map(a => (
                <AccionRow key={a.to} {...a} />
              ))}
            </div>
          </div>

          {/* Tabla de posiciones */}
          <div
            style={{
              background: '#FBF6E6',
              border: '1px solid rgba(22,39,26,.13)',
              borderRadius: 14,
              padding: 22,
            }}
          >
            <div className="flex items-center gap-[8px]" style={{ marginBottom: 14 }}>
              <TrophyIcon className="w-[20px] h-[20px] text-ocre" />
              <h2 className="font-display font-extrabold" style={{ fontSize: 22, textTransform: 'uppercase', whiteSpace: 'nowrap', color: '#16271A' }}>
                Tabla de posiciones
              </h2>
            </div>

            {/* Column headers */}
            <div
              className="font-mono font-bold flex items-center"
              style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(22,39,26,.45)', padding: '0 6px 10px', borderBottom: '1px solid rgba(22,39,26,.12)' }}
            >
              <span>Pos · Jugador</span>
              <span style={{ marginLeft: 'auto' }}>Pts</span>
            </div>

            {rankings.length === 0 ? (
              <div style={{ padding: '20px 6px', textAlign: 'center', color: 'rgba(22,39,26,.3)', fontSize: 13 }} className="font-sans">
                No hay participantes
              </div>
            ) : (
              rankings.slice(0, 5).map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center"
                  style={{ padding: '13px 6px', borderBottom: i < 4 ? '1px solid rgba(22,39,26,.08)' : 'none', gap: 13 }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: medalBg(i),
                      color: i < 3 ? '#14442B' : '#14442B',
                      fontWeight: 700,
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    className="font-mono"
                  >
                    {i + 1}
                  </span>
                  <span className="font-sans font-semibold" style={{ fontSize: 14.5, flex: 1, color: '#16271A' }}>
                    {r.nombre}
                  </span>
                  <span className="font-mono font-bold" style={{ fontSize: 14, color: '#1E6B43' }}>
                    {r.puntos} pts
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
