import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve('dist/client');
const slugs=['planets','movement','spaceship','meteors','factory','research','home','interfaces'];
const home=readFileSync(join(root,'index.html'),'utf8');
assert.match(home,/ORBITAL FALL/);
assert.match(home,/id="features"/);
const styles = readdirSync(root,{recursive:true}).filter(file=>String(file).endsWith('.css'));
assert.ok(styles.some(file=>readFileSync(join(root,file),'utf8').includes('starfield.jpg')),'Space background must be present in exported CSS');
assert.ok(existsSync(join(root,'.nojekyll')));
assert.ok(existsSync(join(root,'404.html')));
assert.ok(!existsSync(join(root,'devlog')) && !existsSync(join(root,'optimization')), 'Retired article routes must not be exported');
const pages=new Map([['/',home],...slugs.map(slug=>[`/features/${slug}/`,readFileSync(join(root,'features',slug,'index.html'),'utf8')])]);
const photos=new Set();
for(const [path,html] of pages){
 assert.match(html,/lang="ko"/);
 assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length,1,'One main heading: '+path);
 assert.equal([...html.matchAll(/src="\/site-analytics\.js"/g)].length,1);
 assert.ok(!/[A-Z]:[\\/](Users|UnrealProjects)/i.test(html),'No private local paths');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,'Unique page anchors: '+path);
 for(const [,raw] of html.matchAll(/(?:src|href)="((?:\/|#)[^"]*)"/g)){
  const url=new URL(raw.replaceAll('&amp;','&'),'https://water-beetle.github.io'+path);
  let file=decodeURIComponent(url.pathname);if(file.endsWith('/'))file+='index.html';
  assert.ok(existsSync(join(root,file)),'Missing linked file: '+path+' -> '+file);
 }
 if(path!=='/'){
  assert.match(html,/data-article-type="feature"/);
  assert.match(html,/현재 범위와 남은 작업/);
  assert.match(html,/comments-feature-/);
  const images=[...html.matchAll(/src="(\/media\/features\/[^"?#]+-thumb\.webp)"/g)].map(m=>m[1]);
  assert.equal(images.length,6,'Six gallery images: '+path);
  for(const image of images)photos.add(image);
 }
}
assert.equal(photos.size,48,'48 distinct screenshots');
assert.equal(readdirSync(join(root,'media/features')).length,96,'Full and thumbnail image pairs');
console.log(`Verified ${pages.size} pages, 48 screenshots, local links, retired routes, analytics and 404.`);
