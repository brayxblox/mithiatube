function renderHeader(active){
  const u=getSession();
  const right=u
    ?`<span class="user-bar"><img src="${esc(u.avatar_url||'https://via.placeholder.com/18')}" alt=""> <a href="channel.html?u=${encodeURIComponent(u.username)}">${esc(u.username)}</a>${u.is_admin?' <span style="background:#c00;color:#fff;font-size:9px;padding:0 3px">ADM</span>':''} | <a href="settings.html">Settings</a> | <a href="#" id="logout-btn">Log Out</a></span>`
    :`<a href="signup.html">Sign Up</a> | <a href="login.html">Log In</a> | <a href="#">Help</a>`;
  return `
  <div class="header-wrap">
    <div class="header-top">
      <div class="logo-block">
        <a href="index.html"><img src="assets/Logo.png" alt="MithiaTube"></a>
        <span class="logo-tagline">Upload, tag and share your videos worldwide!</span>
      </div>
      <form class="header-search" action="videos.html" method="get">
        <input type="text" name="q" placeholder="">
        <button type="submit">Search Videos</button>
      </form>
      <div class="header-right">
        ${right}
        <div class="header-links-extra">
          <a href="upload.html">Upload</a> // <a href="videos.html">Browse</a> // <a href="#">Invite</a>
        </div>
      </div>
    </div>
  </div>
  <div class="nav-bar">
    <a href="index.html">Home</a> |
    <a href="channel.html?u=${u?encodeURIComponent(u.username):''}">My Profile</a> |
    <a href="upload.html">Share <span class="new">NEW</span></a>
  </div>`;
}
function renderFooter(){
  return `<div class="footer">
    <a href="#">About</a> | <a href="#">Help</a> | <a href="#">Terms</a> | <a href="#">Privacy</a><br>
    Copyright © 2006-2026 MithiaTube
  </div>`;
}
function bindLogout(){
  const btn=document.getElementById('logout-btn');
  if(btn)btn.addEventListener('click',e=>{e.preventDefault();clearSession();location.href='index.html';});
}
function videoRow(v){
  const tags=(v.tags||'').split(',').map(t=>t.trim()).filter(Boolean);
  return `<div class="video-row">
    <a href="watch.html?v=${v.id}"><img src="${esc(v.thumbnail||'https://via.placeholder.com/120x90?text=Video')}" alt=""></a>
    <div class="info">
      <a href="watch.html?v=${v.id}" class="title">${esc(v.title)}</a>
      <div class="meta">
        ${esc((v.description||'').substring(0,80))}<br>
        Added: ${timeAgo(v.created_at)} by <a href="channel.html?u=${encodeURIComponent(v.channel||'')}">${esc(v.channel)}</a><br>
        Views: ${fmtViews(v.views)} // Comments: ${v.comments||0}
        ${tags.length?'<br>Tags: '+tags.map(t=>`<a href="videos.html?q=${encodeURIComponent(t)}">${esc(t)}</a>`).join(' '):''}
      </div>
    </div>
  </div>`;
}
