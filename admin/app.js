let papers=[];
async function auth(){const r=await fetch('/api/auth');const x=await r.json();if(!x.ok)location.href='/login.html'}
async function load(){const r=await fetch('/api/manage-paper',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'list'})});if(r.status===401){location.href='/login.html';return}papers=await r.json();papers.sort((a,b)=>Number(b.year)-Number(a.year));render()}
function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function render(){total.textContent=papers.length;ol.textContent=papers.filter(x=>x.exam_type==='OL').length;al.textContent=papers.filter(x=>x.exam_type==='AL').length;rows.innerHTML=papers.map(p=>`<tr><td>${esc(p.title)}</td><td>${esc(p.exam_type)}</td><td>${esc(p.year)}</td><td>${esc(p.subject)}</td><td class="actions-cell"><a href="javascript:editPaper('${encodeURIComponent(p.id)}')">Edit</a><a class="danger-link" href="javascript:delPaper('${encodeURIComponent(p.id)}')">Delete</a></td></tr>`).join('')||'<tr><td colspan="5">No papers yet.</td></tr>'}
function showAdd(){formTitle.textContent='Add New Paper';paperForm.reset();paperForm.id.value='';modal.style.display='grid'}
function closeModal(){modal.style.display='none'}
function editPaper(id){const p=papers.find(x=>x.id===decodeURIComponent(id));if(!p)return;formTitle.textContent='Edit Paper';for(const k of ['id','title','exam_type','year','subject','language','category','download_url'])paperForm[k].value=p[k]??'';modal.style.display='grid'}
paperForm.onsubmit=async e=>{e.preventDefault();err.style.display='none';const b=Object.fromEntries(new FormData(paperForm));b.action=b.id?'edit':'add';b.year=Number(b.year);const r=await fetch('/api/manage-paper',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});const x=await r.json();if(!r.ok){err.textContent=x.error||'Save failed';err.style.display='block';return}closeModal();await load()}
async function delPaper(id){if(!confirm('Delete this paper?'))return;const r=await fetch('/api/manage-paper',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'delete',id:decodeURIComponent(id)})});if(r.ok)load();else alert('Delete failed')}
async function logout(){await fetch('/api/auth',{method:'DELETE'});location.href='/login.html'}
auth().then(load);
