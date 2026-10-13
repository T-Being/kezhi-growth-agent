const fs=require('node:fs');
const path=require('node:path');
const root=__dirname,dist=path.join(root,'dist');
const files=['index.html','styles.css','domain.js','services.js','app.js'];
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});
for(const file of files)fs.copyFileSync(path.join(root,file),path.join(dist,file));
fs.mkdirSync(path.join(dist,'assets'),{recursive:true});
fs.copyFileSync(path.join(root,'assets','zhihui-kezhi.png'),path.join(dist,'assets','zhihui-kezhi.png'));
fs.writeFileSync(path.join(dist,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n');
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
for(const ref of [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(x=>x[1]).filter(x=>!x.startsWith('http'))){if(!fs.existsSync(path.join(dist,ref)))throw new Error(`Missing asset: ${ref}`);}
const app=fs.readFileSync(path.join(dist,'app.js'),'utf8');
for(const ref of [...app.matchAll(/(?:src|href)=?["']([^"']+\.(?:png|svg|jpg|webp))/g)].map(x=>x[1])){if(!fs.existsSync(path.join(dist,ref)))throw new Error(`Missing app asset: ${ref}`);}
console.log(`Production build complete: ${files.length+2} files, ${fs.statSync(path.join(dist,'assets/zhihui-kezhi.png')).size} byte mascot asset verified.`);
