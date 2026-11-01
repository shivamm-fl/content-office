import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseLibrary, loadLibrary, assetKey, libraryPreview, savedReels, mediaResponse } from './library.ts';
const item={item:'b001',title:'Two Sum',track:'blind75',version:'a'.repeat(16),folder:'b001_two_sum',duration_s:78,caption:'caption',youtube:'youtube',video_sha256:'a'.repeat(64),cover_sha256:'b'.repeat(64),saved_at:'2026-11-02'};
test('invalid imported metadata cannot select arbitrary paths or URLs',()=>{
  assert.deepEqual(parseLibrary({items:[{...item,version:'../../private'},{...item,item:'../secret'},{...item,video_sha256:'bad'},{...item,duration_s:999}]}),[]);
  assert.equal(parseLibrary({items:[item,item]}).length,1);
  assert.deepEqual(parseLibrary(null),[]);
});
test('library reads are floor-scoped and saved URLs are authenticated app routes',async()=>{
  let key;const items=await loadLibrary({get:async k=>{key=k;return {items:[item]}}},'dsa');
  assert.equal(key,'reel-library/dsa/manifest.json');
  assert.equal(assetKey('dsa',item,'video'),`reel-library/dsa/b001/${item.version}/video.mp4`);
  assert.equal(savedReels('dsa',items)[0].cover_url,`/api/teams/dsa/library/b001/${item.version}/cover`);
  assert.match(libraryPreview('dsa',item).video_url,/^\/api\/teams\/dsa\/library\//);
  assert.equal('can_schedule' in savedReels('dsa',items)[0],false);
});
test('private media returns exact full and seek bytes, including suffix ranges',async()=>{
  const bytes=Uint8Array.from([10,20,30,40,50]).buffer;
  const full=mediaResponse(bytes,'video/mp4','abc',null);
  assert.equal(full.status,200);assert.equal(full.headers.get('Vary'),'Cookie');assert.match(full.headers.get('Cache-Control'),/^private/);
  assert.deepEqual([...new Uint8Array(await full.arrayBuffer())],[10,20,30,40,50]);
  for(const [range,want] of [['bytes=1-3',[20,30,40]],['bytes=3-',[40,50]],['bytes=-2',[40,50]],['bytes=0-999',[10,20,30,40,50]]]){
    const response=mediaResponse(bytes,'video/mp4','abc',range);assert.equal(response.status,206);assert.deepEqual([...new Uint8Array(await response.arrayBuffer())],want);
  }
  for(const range of ['bytes=5-','bytes=4-1','bytes=','bytes=-0','bytes=0-1,3-4','bytes=999999999999999999-'])assert.equal(mediaResponse(bytes,'video/mp4','abc',range).status,416);
});
