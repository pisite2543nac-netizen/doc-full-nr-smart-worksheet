import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
export async function callFunction<TReq,TRes>(name:string,data:TReq):Promise<TRes>{
 if(!functions) throw new Error('Firebase Functions is unavailable in Demo Mode');
 const fn=httpsCallable<TReq,TRes>(functions,name); const res=await fn(data); return res.data;
}
