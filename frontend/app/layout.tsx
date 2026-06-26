import type { Metadata } from "next"
import "@/styles/globals.css"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { AuthProvider } from "@/providers/AuthProvider"
import { AppLayoutShell } from "@/components/navigation/AppLayoutShell"

export const metadata: Metadata = {
  title: "AI Sales Deal Intelligence Agent",
  description: "Executive AI Sales Copilot for pipeline management and meeting intelligence.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <AppLayoutShell>{children}</AppLayoutShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
