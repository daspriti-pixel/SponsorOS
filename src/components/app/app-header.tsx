import { useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, Sparkles, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/app-context";
import { useAuth } from "@/lib/auth";
import { NAV } from "./app-sidebar";
import { toast } from "sonner";

export function AppHeader() {
  const { session, signOut } = useAuth();
  const { mode, setMode, asOf, setAsOf, setCopilotOpen } = useApp();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const title = NAV.flatMap((g) => [...g.items] as { title: string; url: string }[]).find((i) => i.url === path)?.title ?? "SponsorOS";
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((o) => !o); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const go = (to: string) => { setOpen(false); void navigate({ to }); };

  return (
    <header className="sticky top-0 z-20 flex min-h-14 flex-wrap items-center gap-2 border-b bg-card px-3 py-2 md:px-4">
      <SidebarTrigger />
      <h2 className="mr-2 hidden truncate text-sm font-semibold text-foreground lg:block">{title}</h2>
      <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2">
        <Select value="campusfest">
          <SelectTrigger className="h-8 hidden w-32 md:flex"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="campusfest">CampusFest</SelectItem></SelectContent>
        </Select>
        <Select value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <SelectTrigger className="h-8 w-36 sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="historical">Historical</SelectItem>
            <SelectItem value="simulation">Growth Simulation</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" value={asOf} onChange={(e) => e.target.value && setAsOf(e.target.value)} className="h-8 w-36" aria-label="As of date" />
        <Button variant="outline" size="sm" className="hidden w-44 justify-start text-muted-foreground lg:flex" onClick={() => setOpen(true)}>
          <Search className="h-4 w-4" /> Find page… <kbd className="ml-auto text-[10px]">Ctrl K</kbd>
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 lg:hidden" onClick={() => setOpen(true)} aria-label="Search"><Search className="h-4 w-4" /></Button>
        <Button size="sm" aria-label="Open AI Copilot" onClick={() => setCopilotOpen(true)}><Sparkles className="h-4 w-4" /><span className="hidden sm:inline">AI Copilot</span></Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted" aria-label="Profile"><User className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Signed in<div className="text-xs font-normal text-muted-foreground">{session.user.email}</div></DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { void signOut().catch((error: Error) => toast.error(error.message)); }}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Find a page…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {NAV.flatMap((g) => [...g.items] as { title: string; url: string }[]).map((i) => <CommandItem key={i.url} onSelect={() => go(i.url)}>{i.title}</CommandItem>)}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
