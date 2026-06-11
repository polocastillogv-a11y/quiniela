import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-crema">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
