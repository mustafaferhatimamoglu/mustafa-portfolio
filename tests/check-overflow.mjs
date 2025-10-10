import http from 'http';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function createStaticServer(){
  const server = http.createServer(async (req, res)=>{
    try{
      const url = new URL(req.url, 'http://localhost');
      const reqPath = url.pathname === '/' ? '/index.html' : url.pathname;
      const filePath = path.normalize(path.join(rootDir, reqPath));
      if(!filePath.startsWith(rootDir)){
        res.statusCode = 403;
        res.end('Forbidden');
        return;
      }
      const data = await readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', mime);
      res.end(data);
    }catch(err){
      res.statusCode = 404;
      res.end('Not Found');
    }
  });
  return server;
}

async function listen(server){
  await new Promise((resolve)=>{
    server.listen(0, resolve);
  });
  const address = server.address();
  if(typeof address !== 'object' || !address){
    throw new Error('Failed to bind HTTP server');
  }
  return address.port;
}

async function checkOverflow(){
  const server = createStaticServer();
  const port = await listen(server);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try{
    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 900, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'networkidle0' });
    const result = await page.evaluate(()=>{
      const viewport = window.innerWidth;
      const doc = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
      const offenders = [];
      const toSelector = (el)=>{
        const names = [];
        while(el && el !== document.body){
          let selector = el.tagName.toLowerCase();
          if(el.id){
            selector += `#${el.id}`;
            names.unshift(selector);
            break;
          }
          if(el.classList.length){
            selector += '.' + Array.from(el.classList).join('.');
          }
          names.unshift(selector);
          el = el.parentElement;
        }
        return names.join(' > ');
      };
      document.querySelectorAll('*').forEach(el=>{
        const rect = el.getBoundingClientRect();
        if(rect.width === 0 || rect.height === 0) return;
        if(rect.right - viewport > 1){
          offenders.push({ selector: toSelector(el), overflow: rect.right - viewport });
        }
      });
      const iframes = Array.from(document.querySelectorAll('iframe')).map(el=>toSelector(el));
      return { viewport, scrollWidth, offenders, iframes };
    });

    if(result.iframes.length){
      throw new Error(`Found forbidden <iframe> elements: ${result.iframes.join(', ')}`);
    }

    const overflowAmount = result.scrollWidth - result.viewport;
    if(overflowAmount > 1 || result.offenders.length){
      const details = result.offenders
        .slice(0, 5)
        .map(o=>`${o.selector} (+${o.overflow.toFixed(2)}px)`)
        .join('\n');
      throw new Error(`Layout overflow detected. Scroll width exceeds viewport by ${overflowAmount.toFixed(2)}px.\n${details}`);
    }

    console.log(`No horizontal overflow detected at ${result.viewport}px viewport.`);
  }finally{
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}

checkOverflow().catch(err=>{
  console.error(err.message || err);
  process.exitCode = 1;
});
