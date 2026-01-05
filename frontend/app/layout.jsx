import "./globals.css"

export const metadata = {
  title: "HiddenGems - Discover Hidden Locations",
  description: "Explore and discover hidden gems around the world",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
