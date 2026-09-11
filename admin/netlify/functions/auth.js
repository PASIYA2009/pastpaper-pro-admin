const crypto=require('crypto');
const USER=process.env.ADMIN_USERNAME||'admin';
const PASS=process.env.ADMIN_PASSWORD||'PED2009';
const SECRET=process.env.ADMIN_SESSION_SECRET||PASS;
function sign(v){return crypto.createHmac('sha256',SECRET).update(v).digest('hex')}
function cookie(){const v=Buffer.from(JSON.stringify({u:USER,exp:Date.now()+86400000})).toString('base64url');return `${v}.${sign(v)}`}
function valid(c){try{const [v,s]=String(c||'').split('.');if(!v||!s||!crypto.timingSafeEqual(Buffer.from(s),Buffer.from(sign(v))))return false;const d=JSON.parse(Buffer.from(v,'base64url'));return d.u===USER&&d.exp>Date.now()}catch{return false}}
exports.handler=async(e)=>{const method=e.httpMethod;if(method==='GET'){const c=e.headers.cookie||'';return {statusCode:200,body:JSON.stringify({ok:valid((c.match(/pp_admin=([^;]+)/)||[])[1])})}}if(method==='POST'){let b={};try{b=JSON.parse(e.body||'{}')}catch{}if(b.username!==USER||!PASS||b.password!==PASS)return {statusCode:401,body:JSON.stringify({error:'Invalid username or password'})};return {statusCode:200,headers:{'Set-Cookie':`pp_admin=${cookie()}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,'Content-Type':'application/json'},body:JSON.stringify({ok:true})}}if(method==='DELETE')return {statusCode:200,headers:{'Set-Cookie':'pp_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'},body:JSON.stringify({ok:true})};return {statusCode:405,body:'Method not allowed'}};
