const KEY='garden-last-stand-v1';
export const fresh=()=>({version:1,seeds:0,highestWave:0,totalRuns:0,kills:0,time:0,mastery:0,economy:0,fortress:0});
export function validate(s){if(!s||s.version!==1)throw Error('Versão de save inválida.');for(const k of Object.keys(fresh()).filter(k=>k!=='version'))if(!Number.isSafeInteger(s[k])||s[k]<0||s[k]>1e9)throw Error('Save inválido: '+k);for(const k of ['mastery','economy','fortress'])if(s[k]>10)throw Error('Nível inválido.');return Object.fromEntries(Object.keys(fresh()).map(k=>[k,s[k]]));}
export function read(){try{return validate(JSON.parse(localStorage.getItem(KEY))) }catch{return fresh()}}
export function write(s){try{localStorage.setItem(KEY,JSON.stringify(validate(s)));return true}catch{return false}}
export function download(s){const url=URL.createObjectURL(new Blob([JSON.stringify(s,null,2)],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='pvz_rts_save.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
