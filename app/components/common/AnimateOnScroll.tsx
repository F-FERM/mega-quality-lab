"use client";

import { useEffect, useRef, useState, ReactNode, CSSProperties } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Duration of the animation (ms) */
  duration?: number;
  /** How far below to start (px) */
  translateY?: number;
  /** Extra className for the wrapper */
  className?: string;
  /** IntersectionObserver threshold */
  threshold?: number;
}

/**
 * Wraps children with a fade-up scroll animation.
 * Elements start invisible and shifted downward, then animate upward
 * when they enter the viewport.
 */
export default function AnimateOnScroll({
  children,
  delay = 0,
  duration = 600,
  translateY = 48,
  className = "",
  threshold = 0.12,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // animate only once
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const style: CSSProperties = {
    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    transitionDelay: `${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${translateY}px)`,
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
