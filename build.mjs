import {mkdir,copyFile,cp,readFile,access} from 'node:fs/promises';
const pages=['index.html','works.html','characters.html','about.html','portfolio.html','character-design.html','comics.html','game-art.html','puzzles.html','princess.html','portraits.html','contact.html','contact-thanks.html','illustrations.html','web-design.html','comics-games.html','pricing.html','spot-differences.html','spot-difference-view.html','awards.html'];
for(const file of pages){const html=await readFile(file,'utf8');for(const [,p] of html.matchAll(/(?:src|href)="([^"]+)"/g)){if(!p.startsWith('#') && ! /^(?:https?:|mailto:)/.test(p))await access(p.split(/[?#]/)[0]);}for(const [,id] of html.matchAll(/href="#([^"]+)"/g)){if(!html.includes(`id="${id}"`))throw Error(`Missing section ${id}`);}}
await mkdir('dist',{recursive:true});
for(const file of [...pages,'style.css','detail.css','book.js','sitemap.xml','contact.css','contact.js','motion.css','motion.js','home-additions.css','site-ui.css','site-ui.js','translations.js','pricing.css','pricing-translations.js','portfolio-updates.css','portfolio-updates.js','collection.css','collection.js'])await copyFile(file,`dist/${file}`);
await cp('assets','dist/assets',{recursive:true});
console.log(`Built ${pages.length} pages; verified all navigation and image paths.`);

