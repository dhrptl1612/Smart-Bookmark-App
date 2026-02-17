import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen transition-colors duration-300">
        {children}
      </body>
    </html>
  )
}
