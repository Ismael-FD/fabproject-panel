"use client";

import { RestauranteProvider } from "@/lib/RestauranteContext";
import PanelLayout from "@/components/layout/PanelLayout";

export function Providers({ children }) {
  return (
    <RestauranteProvider>
      {children}
    </RestauranteProvider>
  );
}
