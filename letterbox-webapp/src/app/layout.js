import "./globals.css";
import Header from '@/components/header';
import Footer from '@/components/footer'
import { cookies } from 'next/headers'

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.has('session');
  return (
    <html lang="pt-br">
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Header isLoggedIn={isLoggedIn}/>
        <main className="w-full max-w-6xl mx-auto px-4">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
};