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
      <body className="bg-gray-900 text-white antialiased font-sans">{children}</body>
    </html>
  );
}