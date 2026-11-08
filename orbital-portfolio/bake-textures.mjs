import { deflateSync } from 'node:zlib';

const width = 512, height = 256;
const clamp = x => Math.max(0, Math.min(1, x));
const smooth = (a, b, x) => { x = clamp((x-a)/(b-a)); return x*x*(3-2*x); };
function hash(x,y,z) {
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 2147483647);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
function noise(x,y,z) {
  const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z);
  const fx=smooth(0,1,x-ix),fy=smooth(0,1,y-iy),fz=smooth(0,1,z-iz);
  const mix=(a,b,t)=>a+(b-a)*t;
  const layer=k=>mix(mix(hash(ix,iy,k),hash(ix+1,iy,k),fx),mix(hash(ix,iy+1,k),hash(ix+1,iy+1,k),fx),fy);
  return mix(layer(iz),layer(iz+1),fz);
}
function fbm(x,y,z) {
  let value=0, amplitude=.5;
  for(let i=0;i<4;i++){value+=amplitude*noise(x,y,z);x=x*2.03+3.1;y=y*2.03+1.7;z=z*2.03-2.7;amplitude*=.5;}
  return value;
}
const crcTable = Array.from({length:256},(_,n)=>{
  for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;
  return n>>>0;
});
function chunk(type,data) {
  const name=Buffer.from(type), output=Buffer.alloc(data.length+12);
  output.writeUInt32BE(data.length); name.copy(output,4); data.copy(output,8);
  let crc=0xffffffff;
  for(const byte of Buffer.concat([name,data]))crc=crcTable[(crc^byte)&255]^(crc>>>8);
  output.writeUInt32BE((crc^0xffffffff)>>>0,output.length-4);return output;
}
function png(pixels) {
  const rows=Buffer.alloc(height*(width*3+1));
  for(let y=0;y<height;y++)pixels.copy(rows,y*(width*3+1)+1,y*width*3,(y+1)*width*3);
  const header=Buffer.alloc(13);header.writeUInt32BE(width);header.writeUInt32BE(height,4);header[8]=8;header[9]=2;
  return 'data:image/png;base64,'+Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(rows,{level:9})),chunk('IEND',Buffer.alloc(0))]).toString('base64');
}
/** Generate planet textures at build time and embed them as data-URI PNGs,
 *  so the production build is a single self-contained HTML file with zero
 *  network requests for assets. */
export function bakeTextures() {
  const textures={};
  for(const type of ['ocean','gas','rock','ice','verdant','golden','crimson']){
    const pixels=Buffer.alloc(width*height*3);
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const theta=(1-y/(height-1))*Math.PI,phi=x/(width-1)*Math.PI*2;
      const px=-Math.cos(phi)*Math.sin(theta),py=Math.cos(theta),pz=Math.sin(phi)*Math.sin(theta);
      let color;
      if(type==='ocean'){
        const terrain=fbm(px*3.6+4.2,py*3.6+1.7,pz*3.6+2.1);
        color=terrain>.49?[164,185,91]:[43,126,154];
        if(terrain>.59)color=[214,196,123];
        if(Math.abs(terrain-.49)<.012)color=[20,41,49];
        if(terrain<.45&&noise(px*12,py*12,pz*12)>.62)color=[59,154,175];
        if(Math.abs(py)>.94)color=[221,231,208];
        const cloud=fbm(px*7+2,py*7-3,pz*7+1);
        if(cloud>.66)color=[236,230,204];
        else if(cloud>.643)color=[123,161,156];
      }else if(type==='gas'){
        const band=Math.sin(py*35+fbm(px*4,py*4,pz*4)*6);
        color=band>.45?[209,169,198]:band>-.1?[162,119,172]:[106,78,139];
        if(Math.abs(band+.1)<.08||Math.abs(band-.45)<.065)color=[37,30,54];
      }else if(type==='ice'){
        const bands=fbm(px*5+3,py*5,pz*5);
        color=bands>.55?[192,235,228]:bands>.42?[111,194,212]:[58,129,173];
        if(Math.abs(bands-.46)<.012)color=[34,78,111];
        if(Math.abs(py)>.85)color=[218,242,231];
      }else if(type==='verdant'){
        const terrain=fbm(px*5-2,py*5+4,pz*5);
        color=terrain>.55?[188,205,104]:terrain>.43?[91,161,104]:[38,99,95];
        if(Math.abs(terrain-.43)<.012)color=[23,57,60];
      }else if(type==='golden'){
        const band=Math.sin(py*24+fbm(px*4,py*4,pz*4)*8);
        color=band>.4?[244,211,133]:band>-.2?[211,160,84]:[151,109,70];
        if(Math.abs(band-.4)<.055)color=[78,59,55];
      }else if(type==='crimson'){
        const terrain=fbm(px*5+4,py*5-2,pz*5);
        color=terrain>.54?[232,146,138]:terrain>.41?[194,85,115]:[104,49,92];
        if(Math.abs(terrain-.41)<.016)color=[43,29,58];
        if(noise(px*15,py*15,pz*15)>.76)color=[241,184,153];
      }else{
        const terrain=fbm(px*6,py*6,pz*6);
        color=terrain>.53?[218,156,101]:terrain>.39?[179,110,73]:[136,75,58];
        const crater=noise(px*19,py*19,pz*19);
        if(crater>.76)color=[76,47,48];
        else if(crater>.735)color=[40,30,38];
        else if(crater>.71)color=[232,167,109];
      }
      const i=(y*width+x)*3;pixels[i]=color[0];pixels[i+1]=color[1];pixels[i+2]=color[2];
    }
    textures[type]=png(pixels);
  }
  return textures;
}

export function bakeNebula() {
  const pixels=Buffer.alloc(width*height*3);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const u=x/(width-1),v=y/(height-1);
    const warp=fbm(u*4.2+2,v*4.2-3,.8);
    const cloud=fbm(u*7.5+warp*2,v*7.5+warp*2,1.4);
    const band=Math.exp(-Math.pow((v-(.76-u*.56+warp*.12))/.23,2));
    const wisps=Math.pow(clamp(cloud*2.1-.18),1.2)*band;
    const violet=Math.exp(-((u-.72)**2/.15+(v-.24)**2/.16));
    const pink=Math.exp(-((u-.37)**2/.22+(v-.48)**2/.19));
    const blue=Math.exp(-((u-.88)**2/.14+(v-.70)**2/.12));
    const ridge=Math.pow(1-Math.abs(cloud-.5)*2,5)*band*.18;
    const color=[9+wisps*(125*violet+125*pink+22*blue)+ridge*65,10+wisps*(30*violet+25*pink+65*blue)+ridge*25,27+wisps*(180*violet+135*pink+145*blue)+ridge*105];
    const i=(y*width+x)*3;
    for(let channel=0;channel<3;channel++)pixels[i+channel]=Math.min(255,Math.round(color[channel]));
  }
  return png(pixels);
}
