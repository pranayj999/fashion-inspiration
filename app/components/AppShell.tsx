"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLibraryNav } from "./LibraryNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { goToLibrary } = useLibraryNav();

  return (
    <div className="shell">
      <header className="hero">
        <div>
          <h1>Fashion Inspiration Library</h1>
          <p>
            Upload field captures, classify garments with AI, filter by metadata, and layer
            designer annotations over time.
          </p>
        </div>
        <nav className="site-nav">
          {pathname === "/" ? (
            <button type="button" className="nav-link active" onClick={goToLibrary}>
              Library
            </button>
          ) : (
            <Link href="/" className="nav-link" onClick={() => goToLibrary()}>
              Library
            </Link>
          )}
          <Link href="/eval" className={`nav-link${pathname === "/eval" ? " active" : ""}`}>
            Evaluation
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
