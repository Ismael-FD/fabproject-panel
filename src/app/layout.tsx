import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "FaChat",
  description: "Panel de administración para FaChat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-900 text-white antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}