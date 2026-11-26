import { createContext, useContext, useState, type ReactNode } from "react";
import type { DataMode } from "./types";
import { HISTORICAL_SNAPSHOT_DATE, SIMULATION_SNAPSHOT_DATE } from "@/data/mock";

interface AppCtx {
  mode: DataMode; setMode: (m: DataMode) => void;
  asOf: string; setAsOf: (d: string) => void;
  copilotOpen: boolean; setCopilotOpen: (o: boolean) => void;
}
const Ctx = createContext<AppCtx | null>(null);
export const DEFAULT_AS_OF = HISTORICAL_SNAPSHOT_DATE;

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<DataMode>("historical");
  const [asOf, setAsOf] = useState(DEFAULT_AS_OF);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const setMode = (next: DataMode) => {
    setModeState(next);
    setAsOf(next === "historical" ? HISTORICAL_SNAPSHOT_DATE : SIMULATION_SNAPSHOT_DATE);
  };
  return <Ctx.Provider value={{ mode, setMode, asOf, setAsOf, copilotOpen, setCopilotOpen }}>{children}</Ctx.Provider>;
}
export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside AppProvider");
  return c;
}
