import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movies Watched",
  description: "Track the movies you have watched",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="antialiased bg-slate-950 text-slate-100 min-h-screen selection:bg-indigo-500/30 font-sans"
      >
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 transition-all">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">
                  M
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  Watched
                </h1>
              </div>
              <nav className="flex gap-4">
              </nav>
            </div>
          </header>
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
            {children}
          </main>
          <footer className="border-t border-white/10 py-6 mt-12 bg-slate-950">
            <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Movies Watched App. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
