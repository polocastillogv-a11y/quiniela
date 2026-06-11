import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-crema flex flex-col items-center">
      <div className="w-full">
        <Navbar />
      </div>
      <main className="w-full max-w-[1200px] px-4 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}
