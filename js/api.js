async function api(path,opts={}){
  const res=await fetch(SB_URL+'/rest/v1/'+path,{...opts,headers:{...HDRS,...(opts.headers||{})}});
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.message||('HTTP '+res.status));}
  if(res.status===204)return null;
  return res.json();
}
async function hashPass(p){
  const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(p));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function getVideos(opts={}){
  const order=opts.order||'views.desc';
  const limit=opts.limit||20;
  return api(TABLE_VIDEO+'?select=*&order='+order+'&limit='+limit);
}
async function getVideo(id){
  const d=await api(TABLE_VIDEO+'?id=eq.'+id+'&select=*');
  return d&&d[0]?d[0]:null;
}
async function searchVideos(q,limit=20){
  const enc=encodeURIComponent('%'+q+'%');
  return api(TABLE_VIDEO+'?or=(title.ilike.'+enc+',description.ilike.'+enc+',tags.ilike.'+enc+',channel.ilike.'+enc+')&order=views.desc&limit='+limit);
}
async function createVideo(data){
  return api(TABLE_VIDEO,{method:'POST',body:JSON.stringify(data)});
}
async function deleteVideo(id){
  return api(TABLE_VIDEO+'?id=eq.'+id,{method:'DELETE'});
}
async function bumpViews(id){
  const v=await getVideo(id);
  if(!v)return;
  try{await api(TABLE_VIDEO+'?id=eq.'+id,{method:'PATCH',body:JSON.stringify({views:(v.views||0)+1})});}catch(e){}
}
async function getComments(videoId){
  return api(TABLE_COMMENTS+'?video_id=eq.'+videoId+'&order=created_at.asc&select=*');
}
async function postComment(videoId,username,body){
  return api(TABLE_COMMENTS,{method:'POST',body:JSON.stringify({video_id:videoId,username,body})});
}
async function deleteComment(id){
  return api(TABLE_COMMENTS+'?id=eq.'+id,{method:'DELETE'});
}
async function getProfile(username){
  const d=await api(TABLE_PROFILES+'?username=eq.'+encodeURIComponent(username)+'&select=*');
  return d&&d[0]?d[0]:null;
}
async function updateProfile(username,data){
  return api(TABLE_PROFILES+'?username=eq.'+encodeURIComponent(username),{method:'PATCH',body:JSON.stringify(data)});
}
async function deleteProfile(username){
  return api(TABLE_PROFILES+'?username=eq.'+encodeURIComponent(username),{method:'DELETE'});
}
async function loginUser(username,password){
  const p=await getProfile(username);
  if(!p)throw new Error('User not found');
  const h=await hashPass(password);
  if(p.password_hash!==h)throw new Error('Wrong password');
  return {username:p.username,display_name:p.display_name||p.username,avatar_url:p.avatar_url||'',is_admin:!!p.is_admin};
}
async function registerUser(username,password,displayName){
  const existing=await getProfile(username);
  if(existing)throw new Error('Username already taken');
  const h=await hashPass(password);
  await api(TABLE_PROFILES,{method:'POST',body:JSON.stringify({
    username,
    display_name:displayName||username,
    avatar_url:'',
    bio:'',
    password_hash:h,
    is_admin:false
  })});
  return {username,display_name:displayName||username,avatar_url:'',is_admin:false};
}
function esc(s){
  if(s==null)return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function fmtViews(n){
  n=parseInt(n,10)||0;
  if(n>=1e6)return(n/1e6).toFixed(1).replace(/\.0$/,'')+'M';
  if(n>=1e3)return(n/1e3).toFixed(1).replace(/\.0$/,'')+'K';
  return String(n);
}
function timeAgo(d){
  if(!d)return '';
  const s=(Date.now()-new Date(d).getTime())/1000;
  if(s<60)return Math.floor(s)+' sec ago';
  if(s<3600)return Math.floor(s/60)+' min ago';
  if(s<86400)return Math.floor(s/3600)+' hours ago';
  if(s<604800)return Math.floor(s/86400)+' days ago';
  return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}
function stars(r){
  const f=Math.round(r||0);
  let o='';
  for(let i=1;i<=5;i++)o+=i<=f?'★':'☆';
  return o;
}
function getSession(){
  try{return JSON.parse(localStorage.getItem('mt_user')||'null');}catch(e){return null;}
}
function setSession(u){localStorage.setItem('mt_user',JSON.stringify(u));}
function clearSession(){localStorage.removeItem('mt_user');}
function isAdmin(){const u=getSession();return u&&u.is_admin;}
function canComment(){
  const last=parseInt(localStorage.getItem('mt_last_comment')||'0',10);
  return Date.now()-last>15000;
}
function markCommented(){localStorage.setItem('mt_last_comment',String(Date.now()));}
