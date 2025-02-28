import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Quiz Funnel System',
  description: 'Sistema de Funil de Quizzes com Next.js e Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="container mx-auto py-10">
          <header className="mb-8">
            <h1 className="text-2xl font-bold">Quiz Funnel System</h1>
          </header>
          <main>
            {children}
          </main>
          <footer className="mt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Sua Empresa</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
