import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { LibraryNavProvider } from "@/components/LibraryNav";

export const metadata: Metadata = {
  title: "Fashion Inspiration Library",
  description: "Organize, classify, and search field-captured garment inspiration",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LibraryNavProvider>
          <AppShell>{children}</AppShell>
        </LibraryNavProvider>
      </body>
    </html>
  );
}
