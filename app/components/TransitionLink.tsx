"use client";

import { usePageTransition } from "../contexts/PageTransitionContext";
import { ReactNode, MouseEvent } from "react";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  scroll?: boolean;
}

export default function TransitionLink({
  href,
  children,
  className = "",
  onClick,
  scroll = true
}: TransitionLinkProps) {
  const { startTransition } = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Handle hash navigation on same page
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element && scroll) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Start page transition for different pages
    startTransition(href);
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}