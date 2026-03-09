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
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}