"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface PageTransitionContextType {
  isTransitioning: boolean;
  startTransition: (href: string) => void;
  endTransition: () => void;
  destinationPath: string | null;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [destinationPath, setDestinationPath] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const startTransition = useCallback((href: string) => {
    // Don't transition if we're already on the same page
    if (href === pathname) return;

    // Don't transition if already transitioning
    if (isTransitioning) return;

    setDestinationPath(href);
    setIsTransitioning(true);

    // Wait for the reveal animation to reach its midpoint before navigating
    // This creates a smooth transition where the new page loads behind the animation
    setTimeout(() => {
      router.push(href);
    }, 1800); // Navigate at the peak of the animation
  }, [pathname, router, isTransitioning]);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
    setDestinationPath(null);
  }, []);

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, startTransition, endTransition, destinationPath }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within PageTransitionProvider");
  }
  return context;
}