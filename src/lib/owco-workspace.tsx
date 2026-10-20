import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export const themeNames=['Default','Dark','Emerald','Violet','Rose'] as const;
export type ThemeName=typeof themeNames[number];
export const tagDefaults={FW:'#ef4444',Orange:'#fb923c',Yellow:'#facc15',Natal:'#22c55e',Blue:'#3b82f6',Purple:'#a855f7',Gray:'#9ca3af'};
export type Preferences={theme:ThemeName;tableBackground:string;tableText:string;tags:typeof tagDefaults;widget:string;headlines:string[];rate:string};
export const defaultPreferences:Preferences={theme:'Default',tableBackground:'#f3f4f6',tableText:'#6b7280',tags:tagDefaults,widget:'100',headlines:['Port congestion please clear ASAP'],rate:'95.16'};
const Context=createContext<{preferences:Preferences;setPreferences:(value:Preferences)=>void}|null>(null);
export function WorkspaceProvider({children}:{children:ReactNode}){
 const [preferences,setPreferences]=useState(defaultPreferences);
 useEffect(()=>{const root=document.documentElement;root.dataset['theme']=preferences.theme.toLowerCase();root.classList.toggle('dark',preferences.theme==='Dark');root.style.setProperty('--table-header-bg',preferences.tableBackground);root.style.setProperty('--table-header-text',preferences.tableText);Object.entries(preferences.tags).forEach(([name,color])=>root.style.setProperty(`--tag-${name.toLowerCase()}`,color));},[preferences]);
 return <Context.Provider value={{preferences,setPreferences}}>{children}</Context.Provider>;
}
export function useWorkspace(){const ctx=useContext(Context);if(!ctx)throw new Error('Workspace provider is required');return ctx;}