import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, demoMode } from '../lib/firebase';
import { demoAdmin, demoUser } from '../data/mock';
import type { AppUser, Role } from '../types';
type Ctx={user:AppUser|null;loading:boolean;demoMode:boolean;login:(email:string,password:string)=>Promise<AppUser>;loginDemo:(role:Role)=>void;logout:()=>Promise<void>;reset:(email:string)=>Promise<void>};
const AuthCtx=createContext<Ctx|null>(null);
export function AuthProvider({children}:{children:ReactNode}){const [user,setUser]=useState<AppUser|null>(null);const [loading,setLoading]=useState(!demoMode);
 useEffect(()=>{if(!auth||!db){setLoading(false);return;} return onAuthStateChanged(auth,async u=>{if(!u){setUser(null);setLoading(false);return;} const snap=await getDoc(doc(db,'users',u.uid)); if(!snap.exists()){setUser(null);setLoading(false);return;} const p=snap.data() as Omit<AppUser,'uid'>; if(!p.isActive){await fbSignOut(auth);setUser(null);} else setUser({uid:u.uid,...p}); setLoading(false);});},[]);
 async function login(email:string,password:string){if(!auth||!db)throw new Error('Demo Mode');const c=await signInWithEmailAndPassword(auth,email,password);const s=await getDoc(doc(db,'users',c.user.uid));if(!s.exists())throw new Error('ไม่พบข้อมูลโปรไฟล์ผู้ใช้');const p=s.data() as Omit<AppUser,'uid'>;if(!p.isActive){await fbSignOut(auth);throw new Error('บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ');}const v={uid:c.user.uid,...p};setUser(v);return v;}
 function loginDemo(role:Role){setUser(role==='admin'?demoAdmin:demoUser)}
 async function logout(){if(auth)await fbSignOut(auth);setUser(null)}
 async function reset(email:string){if(auth)await sendPasswordResetEmail(auth,email);}
 const v=useMemo(()=>({user,loading,demoMode,login,loginDemo,logout,reset}),[user,loading]);return <AuthCtx.Provider value={v}>{children}</AuthCtx.Provider>}
export const useAuth=()=>{const v=useContext(AuthCtx);if(!v)throw new Error('AuthProvider missing');return v};
