import {decodePolyline,validateRoute} from './core.js';
export const CONFIG={
  tiles:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  routing:'https://valhalla1.openstreetmap.de/route',
  search:'https://photon.komoot.io/api/'
};
async function getJSON(url,signal){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),22000);
  signal?.addEventListener('abort',()=>controller.abort(),{once:true});
  try{
    const response=await fetch(url,{signal:controller.signal,referrerPolicy:'strict-origin-when-cross-origin'});
    if(!response.ok)throw new Error(response.status===429?'Serviço ocupado. Aguarde um pouco e tente novamente.':'O serviço de mapas não respondeu. Seu desenho foi preservado.');
    return await response.json();
  }catch(e){if(e.name==='AbortError')throw new Error('A consulta demorou demais ou foi cancelada. Tente novamente.');throw e;}
  finally{clearTimeout(timer);}
}
let lastSearch=0;const searchCache=new Map();
export async function searchPlaces(query,signal){
  const key=query.trim().toLowerCase();if(searchCache.has(key))return searchCache.get(key);
  if(Date.now()-lastSearch<1100)throw new Error('Aguarde um segundo antes de pesquisar novamente.');
  lastSearch=Date.now();
  const p=new URLSearchParams({q:query,limit:'5',lat:'-25.43',lon:'-49.27'});
  const data=await getJSON(CONFIG.search+'?'+p,signal);
  const results=(data.features||[]).filter(f=>f.geometry?.coordinates?.length===2&&f.geometry.coordinates.every(Number.isFinite)).map(f=>({lat:f.geometry.coordinates[1],lon:f.geometry.coordinates[0],display_name:[...new Set([f.properties?.name,f.properties?.street,f.properties?.housenumber,f.properties?.city,f.properties?.state,f.properties?.country].filter(Boolean))].join(', ')}));
  if(searchCache.size>=100)searchCache.delete(searchCache.keys().next().value);
  searchCache.set(key,results);return results;
}
export async function snapToRoads(points,signal){
  if(points.length<2)throw new Error('Marque a saída e o destino.');
  if(points.length>40)throw new Error('Para ajustar às ruas, use até 40 pontos. Um desenho à mão pode ser seguido como traçado manual.');
  const request={locations:points.map((p,i)=>({lat:p[0],lon:p[1],type:i===0||i===points.length-1?'break':'through'})),
    costing:'motor_scooter',costing_options:{motor_scooter:{top_speed:50,use_highways:0,use_primary:0,use_tolls:0,use_ferry:0}},
    directions_options:{language:'pt-BR',units:'kilometers'}};
  const data=await getJSON(CONFIG.routing+'?'+new URLSearchParams({json:JSON.stringify(request)}),signal);
  if(!data.trip?.legs?.length)throw new Error('Não foi possível ligar esses pontos pelas ruas. Revise o desenho.');
  const shape=[],cues=[];
  for(const leg of data.trip.legs){
    const decoded=decodePolyline(leg.shape);const offset=shape.length?shape.length-1:0;
    shape.push(...(shape.length?decoded.slice(1):decoded));
    for(const m of leg.maneuvers||[])cues.push({index:offset+m.begin_shape_index,text:m.instruction,type:m.type});
  }
  return validateRoute({version:1,name:'Minha rota',points:shape,cues,mode:'roads',averageSpeed:30});
}
export function parseGPX(text){
  const doc=new DOMParser().parseFromString(text,'application/xml');
  if(doc.querySelector('parsererror'))throw new Error('Arquivo GPX inválido.');
  const segments=[...doc.getElementsByTagNameNS('*','trkseg')].filter(s=>s.getElementsByTagNameNS('*','trkpt').length);
  const routes=[...doc.getElementsByTagNameNS('*','rte')].filter(s=>s.getElementsByTagNameNS('*','rtept').length);
  if(segments.length+routes.length>1)throw new Error('O GPX tem vários trechos. Exporte uma única rota contínua para evitar ligar caminhos separados.');
  const tag=segments.length?'trkpt':'rtept',nodes=[...doc.getElementsByTagNameNS('*',tag)];
  const points=nodes.map(n=>[Number(n.getAttribute('lat')),Number(n.getAttribute('lon'))]);
  if(nodes.some(n=>!n.hasAttribute('lat')||!n.hasAttribute('lon')))throw new Error('GPX sem coordenadas.');
  return validateRoute({version:1,name:doc.getElementsByTagNameNS('*','name')[0]?.textContent||'Rota importada',points,mode:'manual',cues:[]});
}
const xml=t=>String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function toGPX(route){return '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Vai Comigo" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>'+xml(route.name)+'</name><trkseg>'+route.points.map(p=>'<trkpt lat="'+p[0]+'" lon="'+p[1]+'"></trkpt>').join('')+'</trkseg></trk></gpx>';}
