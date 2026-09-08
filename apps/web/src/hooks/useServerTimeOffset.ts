import { useEffect, useState } from 'react';
import { getServerOffsetMs } from '../services/serverTime';
export function useServerTimeOffset(){
  const [offset,setOffset]=useState(0);
  useEffect(()=>{let alive=true;getServerOffsetMs().then(v=>alive&&setOffset(v));return()=>{alive=false}},[]);
  return offset;
}
