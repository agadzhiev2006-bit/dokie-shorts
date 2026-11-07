const fs=require('fs'); global.window={}; global.document={getElementById:()=>({style:{}})};
let src=['base.js','rig.js','figlib.js','anim.js','film.js','film2.js','shots.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n');
src+='\nfs.writeFileSync("shots.json",JSON.stringify(SH.map(s=>[+s.a.toFixed(3),+s.b.toFixed(3)])));console.log(DUR);';
eval(src);
