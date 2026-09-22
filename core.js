const R = 6371008.8;
const rad = Math.PI / 180;

export function distance(a,b) {
  const x=Math.sin((b[0]-a[0])*rad/2), y=Math.sin((b[1]-a[1])*rad/2);
  return 2*R*Math.asin(Math.min(1,Math.sqrt(x*x+Math.cos(a[0]*rad)*Math.cos(b[0]*rad)*y*y)));
}
export function metrics(points) {
  let total=0; const cumulative=[0];
  for(let i=1;i<points.length;i++){ total+=distance(points[i-1],points[i]); cumulative.push(total); }
  return {total,cumulative};
}
export function locate(point,points,{previous=null,elapsed=1}={}) {
  const {total,cumulative}=metrics(points), candidates=[];
  const xscale=R*rad*Math.max(.001,Math.cos(point[0]*rad)), yscale=R*rad;
  for(let i=0;i<points.length-1;i++){
    const a=points[i],b=points[i+1];
    const ax=(a[1]-point[1])*xscale,ay=(a[0]-point[0])*yscale;
    const dx=(b[1]-a[1])*xscale,dy=(b[0]-a[0])*yscale,den=dx*dx+dy*dy;
    const t=den?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/den)):0;
    const along=cumulative[i]+(cumulative[i+1]-cumulative[i])*t;
    candidates.push({index:i,t,along,off:Math.hypot(ax+t*dx,ay+t*dy),total,remaining:total-along});
  }
  if(!candidates.length) throw new Error('A rota precisa de dois pontos.');
  const bestOf=items=>items.reduce((best,c)=>c.off<best.off-.05?c:best);
  const globalBest=bestOf(candidates);
  if(previous===null)return globalBest;
  const lower=previous-100,upper=previous+Math.max(180,Math.min(elapsed,20)*30+90);
  const nearby=candidates.filter(c=>c.along>=lower&&c.along<=upper);
  if(nearby.length){const local=bestOf(nearby);if(local.off<=globalBest.off+20)return local;}
  return {...globalBest,ambiguous:globalBest.along<lower||globalBest.along>upper};
}
export function fixStatus(fix,now=Date.now()) {
  if(!fix || !Number.isFinite(fix.timestamp) || now-fix.timestamp>12000 || fix.timestamp>now+5000)return 'stale';
  if(!Number.isFinite(fix.accuracy) || fix.accuracy<0 || fix.accuracy>45)return 'inaccurate';
  return 'ok';
}
export function hasArrived(match,accuracy,endDistance){
  return accuracy<=40 && match.total>30 && match.along/match.total>.98 && match.remaining<30 && match.off<30 && endDistance<35;
}
export function validateRoute(input){
  if(!input || input.version!==1)throw new Error('Formato de rota inválido.');
  if(!Array.isArray(input.points)||input.points.length<2||input.points.length>20000)throw new Error('A rota precisa ter de 2 a 20.000 pontos.');
  const points=input.points.map(p=>{
    if(!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)||Math.abs(p[0])>85||Math.abs(p[1])>180)throw new Error('A rota contém coordenadas inválidas.');
    return [...p];
  });
  if(metrics(points).total<5)throw new Error('Os pontos estão próximos demais.');
  if(input.cues!==undefined && (!Array.isArray(input.cues)||input.cues.length>2000))throw new Error('Lista de instruções inválida.');
  const cues=(input.cues||[]).map(c=>{
    if(!c || !Number.isInteger(c.index)||c.index<0||c.index>=points.length||typeof c.text!=='string')throw new Error('A rota contém instruções inválidas.');
    return {index:c.index,text:c.text.slice(0,500),type:Number.isInteger(c.type)?c.type:0};
  }).sort((a,b)=>a.index-b.index);
  return {version:1,name:typeof input.name==='string'?input.name.slice(0,100).trim()||'Minha rota':'Minha rota',
    points,mode:input.mode==='roads'?'roads':'manual',cues:input.mode==='roads'?cues:[],
    averageSpeed:Math.max(10,Math.min(50,Number(input.averageSpeed)||30)),
    notes:typeof input.notes==='string'?input.notes.slice(0,1000):'',
    id:typeof input.id==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(input.id)?input.id:undefined};
}
export function encodePolyline(points,precision=6){
  let last=[0,0],out=''; const factor=10**precision;
  for(const p of points)for(let i=0;i<2;i++){
    const v=Math.round(p[i]*factor),d=v-last[i]; last[i]=v;
    let n=d<0?~(d<<1):(d<<1);
    while(n>=0x20){out+=String.fromCharCode((0x20|(n&0x1f))+63);n>>>=5;}
    out+=String.fromCharCode(n+63);
  }
  return out;
}
export function decodePolyline(encoded,precision=6){
  if(typeof encoded!=='string'||encoded.length>500000)throw new Error('Traçado inválido.');
  const points=[];let i=0,lat=0,lon=0;
  const read=()=>{let result=0,shift=0,b;do{
    if(i>=encoded.length||shift>30)throw new Error('Traçado inválido.');
    b=encoded.charCodeAt(i++)-63;if(b<0||b>63)throw new Error('Traçado inválido.');
    result|=(b&0x1f)<<shift;shift+=5;
  }while(b>=0x20);return result&1?~(result>>1):result>>1;};
  while(i<encoded.length){lat+=read();lon+=read();points.push([lat/10**precision,lon/10**precision]);}
  return points;
}
export function encodeRoute(route){
  const valid=validateRoute(route), {points,id,...rest}=valid;
  const bytes=new TextEncoder().encode(JSON.stringify({...rest,shape:encodePolyline(points)}));
  let binary='';for(const b of bytes)binary+=String.fromCharCode(b);
  return btoa(binary).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
}
export function decodeRoute(encoded){
  if(encoded.length>800000)throw new Error('Link grande demais. Use o arquivo da rota.');
  try{
    const bin=atob(encoded.replaceAll('-','+').replaceAll('_','/'));
    const raw=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(bin,c=>c.charCodeAt(0))));
    return validateRoute({...raw,points:decodePolyline(raw.shape)});
  }catch{throw new Error('Link de rota inválido ou incompleto.');}
}
export function formatDistance(m){return m>=1000?(m/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+' km':Math.max(0,Math.round(m/10)*10)+' m';}
export function simplify(points,minMeters=8){
  if(points.length<3)return points;
  const out=[points[0]];
  for(let i=1;i<points.length-1;i++)if(distance(out.at(-1),points[i])>=minMeters)out.push(points[i]);
  out.push(points.at(-1));return out;
}

export function nextCue(cues,cumulative,along){return cues.find(c=>c.index>0&&cumulative[c.index]>=along-8);}
