import "./globals.css";

export const metadata = {
  title: "FabProject Panel",
  description: "Panel de administración para FabProject",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-neutral-50 text-neutral-900 antialiased font-sans">{children}</body>
    </html>
  );
}