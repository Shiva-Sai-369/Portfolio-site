import React, { createContext, useCallback, useContext, useState } from "react";

export type Tone = "formal" | "casual";

interface ToneContextValue {
  tone: Tone;
  setTone: (tone: Tone) => void;
  toggleTone: () => void;
}

const ToneContext = createContext<ToneContextValue | null>(null);

export const ToneProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tone, setTone] = useState<Tone>("formal");
  const toggleTone = useCallback(
    () => setTone((t) => (t === "formal" ? "casual" : "formal")),
    [],
  );
  return (
    <ToneContext.Provider value={{ tone, setTone, toggleTone }}>
      {children}
    </ToneContext.Provider>
  );
};

export const useTone = (): ToneContextValue => {
  const ctx = useContext(ToneContext);
  if (!ctx) throw new Error("useTone must be used inside <ToneProvider>");
  return ctx;
};

/**
 * Crossfades between the formal and casual versions of a section's copy.
 * Both versions are rendered stacked in one grid cell, so layout never jumps
 * and only opacity animates. The inactive layer is hidden from pointer and
 * assistive tech.
 *
 * Usage: <ToneText copy={heroCopy}>{(c) => <p>{c.sub}</p>}</ToneText>
 */
export function ToneText<T>({
  copy,
  children,
  className = "",
}: {
  copy: Record<Tone, T>;
  children: (copy: T) => React.ReactNode;
  className?: string;
}) {
  const { tone } = useTone();
  return (
    <div className={`grid ${className}`}>
      {(["formal", "casual"] as const).map((t) => (
        <div
          key={t}
          aria-hidden={tone !== t}
          className={`[grid-area:1/1] transition-opacity duration-500 ease-in-out ${
            tone === t ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {children(copy[t])}
        </div>
      ))}
    </div>
  );
}
