import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';
const route = {version:1, name:'Casa → café ☕', points:[[0,0],[0,.01],[.01,.01]], mode:'manual', cues:[], averageSpeed:30};

test('geodesic distance uses meters',()=>{
 assert.ok(Math.abs(core.distance([0,0],[0,.01])-1111.95)<1);
});
test('projection reports traveled distance and perpendicular deviation',()=>{
 const p=core.locate([.002,.005],[[0,0],[0,.01]]);
 assert.ok(Math.abs(p.along-556)<2); assert.ok(Math.abs(p.off-222)<2);
});
test('a loop does not jump to the finish at its starting point',()=>{
 const p=core.locate([0,0],[[0,0],[0,.01],[.01,.01],[.01,0],[0,0]],{previous:0,elapsed:1});
 assert.ok(p.along<10);
});
test('an intersection keeps the current part of the route',()=>{
 const p=core.locate([0,.005],[[0,0],[0,.01],[.01,.01],[.01,.005],[-.01,.005]],{previous:400,elapsed:2});
 assert.ok(p.along<700);
});
test('a corrupted coordinate and an empty route are rejected',()=>{
 assert.throws(()=>core.validateRoute({...route,points:[[95,0],[0,0]]}),/coordenadas/);
 assert.throws(()=>core.validateRoute({...route,points:[]}),/pontos/);
 assert.throws(()=>core.validateRoute({...route,points:[['0',0],[0,.01]]}),/coordenadas/);
});
test('share links round trip unicode and coordinates',()=>{
 const result=core.decodeRoute(core.encodeRoute(route));
 assert.equal(result.name,'Casa → café ☕'); assert.deepEqual(result.points,route.points);
});
test('malformed sharing data is rejected',()=>{
 assert.throws(()=>core.decodeRoute('not-route'),/inválid/); assert.throws(()=>core.decodeRoute('a'.repeat(900000)),/grande/);
});
test('old and imprecise fixes cannot produce directions',()=>{
 assert.equal(core.fixStatus({timestamp:1000,accuracy:10},15000),'stale');
 assert.equal(core.fixStatus({timestamp:14000,accuracy:90},15000),'inaccurate');
 assert.equal(core.fixStatus({timestamp:14000,accuracy:10},15000),'ok');
});
test('no false arrival from an inaccurate fix or loop start',()=>{
 assert.equal(core.hasArrived({remaining:10,along:1000,total:1010,off:5},90,8),false);
 assert.equal(core.hasArrived({remaining:4400,along:0,total:4400,off:0},10,0),false);
 assert.equal(core.hasArrived({remaining:10,along:1000,total:1010,off:5},10,8),true);
});
test('standard polyline precision is decoded correctly',()=>{
 assert.deepEqual(core.decodePolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@',5),[[38.5,-120.2],[40.7,-120.95],[43.252,-126.453]]);
});
test('invalid cue indices cannot escape the route',()=>{
 assert.throws(()=>core.validateRoute({...route,mode:'roads',cues:[{index:50,text:'Turn'}]}),/instruções/);
});
test('sparse geometry never estimates the length as a number of points',()=>{
 assert.ok(Math.abs(core.metrics([[0,0],[0,.01],[0,.02]]).total-2223.9)<2);
});
test('distant rejoin keeps real deviation and asks for explicit progress recovery for any sampling',()=>{
 const dense=Array.from({length:101},(_,i)=>[0,i*.0001]),sparse=[[0,0],[0,.01]];
 for(const points of [dense,sparse]){const m=core.locate([0,.005],points,{previous:111,elapsed:1});assert.ok(m.off<1);assert.equal(m.ambiguous,true);const recovered=core.locate([0,.005],points);assert.ok(recovered.off<1);assert.ok(!recovered.ambiguous);}
});
test('upcoming turn remains until passed, including twelve meters before it',()=>{
 const cues=[{index:1,text:'Direita'},{index:2,text:'Esquerda'}],cumulative=[0,100,200];
 assert.equal(core.nextCue(cues,cumulative,88).text,'Direita');
 assert.equal(core.nextCue(cues,cumulative,103).text,'Direita');
 assert.equal(core.nextCue(cues,cumulative,110).text,'Esquerda');
});
