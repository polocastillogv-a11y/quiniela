import Navbar from './Navbar'
import Sunburst from '../ui/Sunburst'
import LiveScoreBar from '../live/LiveScoreBar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-crema flex flex-col items-center relative">
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
