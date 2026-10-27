const fs=require('fs');
const p=require('path');
const fDir='src/app/components/forms';

const getFiles=(d)=>{
    let res=[];
    fs.readdirSync(d,{withFileTypes:true}).forEach(i=>{
        const jp=p.join(d,i.name);
        if(i.isDirectory()) res=res.concat(getFiles(jp));
        else if(jp.endsWith('.html')) res.push(jp);
    });
    return res;
};

getFiles(fDir).forEach(f=>{
    let c=fs.readFileSync(f,'utf8');
    c=c.replace(/<img src="assets\/ncaaa-logo\.png" alt="NCAAA" class="logo">/g, '<!-- <img src="assets/ncaaa-logo.png" alt="NCAAA" class="logo"> -->');
    c=c.replace(/<img src="assets\/riyadh-logo\.png" alt="Riyadh University" class="logo">/g, '<!-- <img src="assets/riyadh-logo.png" alt="Riyadh University" class="logo"> -->');
    fs.writeFileSync(f,c);
});
console.log('Done replacing logos');
