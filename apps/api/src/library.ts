// Owner-private files imported by an authenticated Cloudflare administrator.
// A saved reel never enters the publishing queue or implies studio/owner approval.
export interface SavedReel {
  item: string; title: string; track: string; duration_s: number; cover_url: string;
  version: string; approved: boolean; approved_at: number | null;
}
export interface LibraryApproval {
  version: string; video_sha256: string; cover_sha256: string; approved_at: number; approved_by: string;
  title: string; caption: string; youtube: string;
}
export function approvalMatches(item:LibraryItem,record:LibraryApproval|null|undefined):record is LibraryApproval {
  return Boolean(record && record.version===item.version && record.video_sha256===item.video_sha256 &&
    record.cover_sha256===item.cover_sha256 && record.title===item.title && record.caption===item.caption &&
    record.youtube===item.youtube && Number.isFinite(record.approved_at) && typeof record.approved_by==='string');
}
export const approvalKey=(item:string,version:string)=>`library.approval.${item}.${version}`;
export interface LibraryItem {
  item: string; title: string; track: string; version: string; folder: string;
  duration_s: number; caption: string; youtube: string;
  video_sha256: string; cover_sha256: string; saved_at: string;
}
interface Store { get(key: string, type: "json"): Promise<unknown> }
const ID=/^[a-z]\d{2,4}$/;
const SHA=/^[a-f0-9]{64}$/;
export const manifestKey=(team:string)=>`reel-library/${team}/manifest.json`;
export function assetKey(team:string,item:LibraryItem,kind:"video"|"cover") {
  return `reel-library/${team}/${item.item}/${item.version}/${kind==='video'?'video.mp4':'cover.png'}`;
}
export function parseLibrary(raw:unknown): LibraryItem[] {
  if(!raw || typeof raw!=='object' || !('items' in raw) || !Array.isArray(raw.items)) return [];
  const items=raw.items.filter((x:unknown):x is LibraryItem=>{
    if(!x || typeof x!=='object')return false;
    const a=x as LibraryItem;
    return ID.test(a.item) && typeof a.title==='string' && a.title.length<=200 &&
      typeof a.track==='string' && /^[a-f0-9]{16}$/.test(a.version) &&
      typeof a.folder==='string' && /^[\w-]{1,100}$/.test(a.folder) &&
      Number.isFinite(a.duration_s) && a.duration_s>=20 && a.duration_s<=180 &&
      typeof a.caption==='string' && a.caption.length<=20000 &&
      typeof a.youtube==='string' && a.youtube.length<=20000 &&
      SHA.test(a.video_sha256) && SHA.test(a.cover_sha256) && typeof a.saved_at==='string';
  });
  const unique=new Map(items.map(x=>[x.item,x]));
  return [...unique.values()].sort((a,b)=>a.item.localeCompare(b.item,undefined,{numeric:true}));
}
export async function loadLibrary(store:Store,team:string):Promise<LibraryItem[]> {
  return parseLibrary(await store.get(manifestKey(team),'json'));
}
export function savedReels(team:string,items:LibraryItem[],approvals:Record<string,LibraryApproval>={}):SavedReel[] {
  return items.map(a=>({item:a.item,title:a.title,track:a.track,duration_s:a.duration_s,version:a.version,
    approved:approvalMatches(a,approvals[a.item]),approved_at:approvalMatches(a,approvals[a.item])?approvals[a.item].approved_at:null,
    cover_url:`/api/teams/${team}/library/${a.item}/${a.version}/cover`}));
}
export function libraryPreview(team:string,a:LibraryItem,approval?:LibraryApproval) {
  const base=`/api/teams/${team}/library/${a.item}/${a.version}`;
  return {item:a.item,title:a.title,video_url:`${base}/video`,cover_url:`${base}/cover`,
    caption:a.caption,youtube:a.youtube,duration_s:a.duration_s,source:'office' as const,
    version:a.version,approved:approvalMatches(a,approval),approved_at:approvalMatches(a,approval)?approval.approved_at:null};
}
// The same origin's video element uses authenticated byte-range requests to seek.
export function mediaResponse(bytes:ArrayBuffer,type:string,etag:string,range:string|null):Response {
  const total=bytes.byteLength;
  const headers=new Headers({'Content-Type':type,'Accept-Ranges':'bytes',
    'Cache-Control':'private, max-age=3600','Vary':'Cookie','ETag':`"${etag}"`});
  if(!range){headers.set('Content-Length',String(total));return new Response(bytes,{headers});}
  const match=/^bytes=(\d*)-(\d*)$/.exec(range);
  if(!match || (!match[1]&&!match[2]))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${total}`}});
  const start=match[1]?Number(match[1]):Math.max(0,total-Number(match[2]));
  const end=match[1]?(match[2]?Math.min(Number(match[2]),total-1):total-1):total-1;
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=total||start<0)
    return new Response(null,{status:416,headers:{'Content-Range':`bytes */${total}`}});
  headers.set('Content-Length',String(end-start+1));headers.set('Content-Range',`bytes ${start}-${end}/${total}`);
  return new Response(bytes.slice(start,end+1),{status:206,headers});
}
