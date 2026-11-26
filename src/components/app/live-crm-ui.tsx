import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, LoadingState } from '@/components/app/shared';
import type { ReactNode } from 'react';
export function Choice({value,onChange,options,placeholder='Select…'}:{value:string;onChange:(v:string)=>void;options:{value:string;label:string}[];placeholder?:string}){return <select className="h-9 w-full rounded-md border bg-background px-2 text-sm" value={value} onChange={e=>onChange(e.target.value)}><option value="">{placeholder}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>;}
export function TextField({label,value,onChange,type='text'}:{label:string;value:string;onChange:(v:string)=>void;type?:string}){return <Field label={label}><Input type={type} value={value} onChange={e=>onChange(e.target.value)}/></Field>;}
export function LoadGate({error,refresh,children,ready}:{error:string|undefined;refresh:()=>void;children:ReactNode;ready:boolean}){return error?<div className="rounded-lg border p-5 text-sm"><p className="text-destructive">Database request failed: {error}</p><Button className="mt-3" onClick={refresh}>Retry</Button></div>:ready?<>{children}</>:<LoadingState/>;}
