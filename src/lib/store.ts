import { useSyncExternalStore } from "react";
import { SEED_CAMPAIGNS, SEED_DEALS, SEED_EXPERIMENTS, SEED_PAYMENTS, SEED_SPONSORS, SEED_TASKS } from "@/data/mock";
import type { Campaign, Deal, Experiment, Payment, Sponsor, Task } from "./types";

/**
 * Temporary data service backed by localStorage. Each collection exposes list/upsert/remove so it can
 * later be swapped for database queries without touching UI components.
 */
export interface AppData {
  sponsors: Sponsor[];
  deals: Deal[];
  tasks: Task[];
  payments: Payment[];
  campaigns: Campaign[];
  experiments: Experiment[];
}
type Key = keyof AppData;
const KEY = "sponsoros:data:v2";
const SEED: AppData = { sponsors: SEED_SPONSORS, deals: SEED_DEALS, tasks: SEED_TASKS, payments: SEED_PAYMENTS, campaigns: SEED_CAMPAIGNS, experiments: SEED_EXPERIMENTS };

let state: AppData = SEED;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...SEED, ...(JSON.parse(raw) as Partial<AppData>) };
  } catch {
    state = SEED;
  }
}
function commit(next: AppData) {
  state = next;
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota */ }
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  if (!loaded) { load(); queueMicrotask(l); }
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, () => state, () => SEED);
}

export const newId = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;

export const dataService = {
  upsert<K extends Key>(key: K, item: AppData[K][number]) {
    const list = state[key] as { id: string }[];
    const exists = list.some((x) => x.id === (item as { id: string }).id);
    const next = exists ? list.map((x) => (x.id === (item as { id: string }).id ? item : x)) : [item, ...list];
    commit({ ...state, [key]: next });
  },
  remove(key: Key, id: string) {
    commit({ ...state, [key]: (state[key] as { id: string }[]).filter((x) => x.id !== id) });
  },
  reset() { commit(SEED); },
};
