import "./globals.css";
import Header from '@/components/header';
import Footer from '@/components/footer'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="bg-slate-950 min-h-screen flex flex-col text-slate-100 antialiased" suppressHydrationWarning>
        <Header/>
        <main className="grow">
          {children}
          </main>
        <Footer/>
      </body>
    </html>
  );
};