(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))f(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const u of a.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&f(u)}).observe(document,{childList:!0,subtree:!0});function c(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function f(t){if(t.ep)return;t.ep=!0;const a=c(t);fetch(t.href,a)}})();const w="",k=w.replace(/\/+$/,""),y=`${k}/api/tasks`;async function $(){const e=await fetch(y);if(!e.ok)throw new Error(await e.text());return e.json()}async function E(e){const r=await fetch(y,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:e})});if(!r.ok)throw new Error(await r.text());return r.json()}async function N(e,r){const c=await fetch(`${y}/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!c.ok)throw new Error(await c.text());return c.json()}async function S(e){const r=await fetch(`${y}/${e}`,{method:"DELETE"});if(!r.ok&&r.status!==204)throw new Error(await r.text())}const T=document.querySelector("#app");function p(e){var t,a,u;const{tasks:r,error:c,loading:f}=e;T.innerHTML=`
    <h1>Tasks</h1>
    <div class="panel">
      ${c?`<p class="error">${g(c)}</p>`:""}
      <form class="add" id="add-form">
        <input
          type="text"
          name="title"
          placeholder="New task…"
          autocomplete="off"
          ${f?"disabled":""}
        />
        <button type="submit" ${f?"disabled":""}>Add</button>
      </form>
      ${r.length===0?'<p class="empty">No tasks yet.</p>':`<ul class="tasks" id="task-list">
              ${r.slice().sort((s,o)=>s.id-o.id).map(s=>`
                <li data-id="${s.id}">
                  <label>
                    <input type="checkbox" ${s.done?"checked":""} data-action="toggle" />
                    <span class="${s.done?"done":""}">${g(s.title)}</span>
                  </label>
                  <button type="button" class="delete" data-action="delete" title="Delete">×</button>
                </li>`).join("")}
            </ul>`}
    </div>
  `,(t=document.querySelector("#add-form"))==null||t.addEventListener("submit",async s=>{s.preventDefault();const o=s.target.elements.title,n=o.value.trim();if(n){d({...i(),loading:!0,error:null});try{await E(n),o.value="",await m()}catch(l){d({...i(),loading:!1,error:l.message||"Failed to add task"}),p(i())}}}),(a=document.querySelector("#task-list"))==null||a.addEventListener("change",async s=>{const o=s.target.closest('input[type="checkbox"][data-action="toggle"]');if(!o)return;const n=o.closest("li"),l=Number(n==null?void 0:n.dataset.id);if(Number.isFinite(l))try{await N(l,{done:o.checked}),await m()}catch(h){d({...i(),error:h.message||"Failed to update"}),p(i())}}),(u=document.querySelector("#task-list"))==null||u.addEventListener("click",async s=>{const o=s.target.closest('button[data-action="delete"]');if(!o)return;const n=o.closest("li"),l=Number(n==null?void 0:n.dataset.id);if(Number.isFinite(l))try{await S(l),await m()}catch(h){d({...i(),error:h.message||"Failed to delete"}),p(i())}})}function g(e){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}let b={tasks:[],error:null,loading:!1};function i(){return b}function d(e){b=e}async function m(){d({...i(),loading:!0,error:null});try{const e=await $();d({tasks:e,error:null,loading:!1})}catch(e){d({tasks:[],error:e.message||"Could not load tasks",loading:!1})}p(i())}m();
