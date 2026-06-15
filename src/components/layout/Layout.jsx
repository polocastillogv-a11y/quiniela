import Navbar from './Navbar'
import Sunburst from '../ui/Sunburst'
import LiveScoreBar from '../live/LiveScoreBar'
import useBackgroundStore from '../../store/backgroundStore'

export default function Layout({ children }) {
  const alternate = useBackgroundStore(s => s.alternate)

  return (
    <div
      className={`min-h-screen flex flex-col items-center relative ${alternate ? 'bg-cover bg-center bg-fixed' : 'bg-crema'}`}
      style={alternate ? { backgroundImage: 'url(/fondo_mund2.png)' } : {}}
    >
      <Sunburst className="opacity-[0.025]" />
      <div className="w-full relative z-1">
        <Navbar />
      </div>
      <main className="w-full max-w-[1200px] px-4 lg:px-8 py-6 relative z-1">
        <LiveScoreBar />
        {children}
      </main>
    </div>
  )
}
