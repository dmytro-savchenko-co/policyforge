import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;

  if (!siteId) {
    return new NextResponse("// Missing siteId", {
      status: 400,
      headers: { "Content-Type": "application/javascript" },
    });
  }

  // Read customization from query params
  const url = new URL(req.url);
  const position = url.searchParams.get("position") || "bottom";
  const primaryColor = url.searchParams.get("primaryColor") || "#2563eb";
  const bgColor = url.searchParams.get("bgColor") || "#1e293b";
  const textColor = url.searchParams.get("textColor") || "#f1f5f9";
  const headline = url.searchParams.get("headline") || "We value your privacy";
  const description =
    url.searchParams.get("description") ||
    "We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking \\\"Accept All\\\", you consent to our use of cookies.";
  const acceptText = url.searchParams.get("acceptText") || "Accept All";
  const rejectText = url.searchParams.get("rejectText") || "Reject All";
  const customizeText = url.searchParams.get("customizeText") || "Customize";

  const js = generateBannerJS({
    siteId,
    position,
    primaryColor,
    bgColor,
    textColor,
    headline,
    description,
    acceptText,
    rejectText,
    customizeText,
  });

  return new NextResponse(js, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

interface BannerConfig {
  siteId: string;
  position: string;
  primaryColor: string;
  bgColor: string;
  textColor: string;
  headline: string;
  description: string;
  acceptText: string;
  rejectText: string;
  customizeText: string;
}

function generateBannerJS(config: BannerConfig): string {
  const c = config;
  // Escape strings for JS embedding
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"');

  return `(function(){
"use strict";
var PF_SITE='${esc(c.siteId)}';
var PF_KEY='pf_consent_'+PF_SITE;
var saved=null;
try{saved=JSON.parse(localStorage.getItem(PF_KEY));}catch(e){}
if(saved&&saved.v===1){applyConsent(saved);fireEvent(saved);return;}

var pos='${esc(c.position)}';
var pCol='${esc(c.primaryColor)}';
var bg='${esc(c.bgColor)}';
var txt='${esc(c.textColor)}';

function injectStyles(){
var s=document.createElement('style');
s.textContent=\`
.pf-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:999998;opacity:0;transition:opacity .3s}
.pf-overlay.pf-show{opacity:1}
.pf-banner{position:fixed;\${pos==='top'?'top:0':'bottom:0'};left:0;width:100%;background:\${bg};color:\${txt};z-index:999999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.5;box-shadow:0 -2px 20px rgba(0,0,0,0.15);transform:translateY(\${pos==='top'?'-100%':'100%'});transition:transform .35s ease}
.pf-banner.pf-show{transform:translateY(0)}
.pf-inner{max-width:960px;margin:0 auto;padding:20px 24px;display:flex;flex-wrap:wrap;align-items:center;gap:16px}
.pf-text{flex:1 1 400px}
.pf-text h3{margin:0 0 4px;font-size:16px;font-weight:600}
.pf-text p{margin:0;opacity:0.85;font-size:13px}
.pf-btns{display:flex;gap:8px;flex-wrap:wrap}
.pf-btn{border:none;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:600;cursor:pointer;transition:opacity .2s,transform .1s}
.pf-btn:hover{opacity:0.9}
.pf-btn:active{transform:scale(0.97)}
.pf-btn-accept{background:\${pCol};color:#fff}
.pf-btn-reject{background:transparent;color:\${txt};border:1px solid rgba(255,255,255,0.3)}
.pf-btn-custom{background:transparent;color:\${txt};border:1px solid rgba(255,255,255,0.2);font-size:12px;padding:8px 14px}
.pf-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.95);background:#fff;color:#1a1a2e;border-radius:16px;z-index:1000000;width:90%;max-width:480px;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);opacity:0;transition:opacity .25s,transform .25s;padding:28px}
.pf-modal.pf-show{opacity:1;transform:translate(-50%,-50%) scale(1)}
.pf-modal h3{margin:0 0 16px;font-size:18px;font-weight:700}
.pf-cat{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #e5e7eb}
.pf-cat:last-of-type{border-bottom:none}
.pf-cat-info{flex:1}
.pf-cat-name{font-weight:600;font-size:14px}
.pf-cat-desc{font-size:12px;color:#64748b;margin-top:2px}
.pf-toggle{position:relative;width:44px;height:24px;flex-shrink:0;margin-left:12px}
.pf-toggle input{opacity:0;width:0;height:0}
.pf-toggle span{position:absolute;inset:0;background:#cbd5e1;border-radius:24px;cursor:pointer;transition:background .2s}
.pf-toggle span:before{content:'';position:absolute;width:18px;height:18px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:transform .2s}
.pf-toggle input:checked+span{background:\${pCol}}
.pf-toggle input:checked+span:before{transform:translateX(20px)}
.pf-toggle input:disabled+span{opacity:0.6;cursor:not-allowed}
.pf-modal-btns{display:flex;gap:8px;margin-top:20px}
.pf-modal-btns .pf-btn{flex:1}
@media(max-width:600px){.pf-inner{flex-direction:column;text-align:center}.pf-btns{justify-content:center;width:100%}.pf-btn{flex:1;min-width:0}}
\`;
document.head.appendChild(s);
}

function createBanner(){
injectStyles();
var overlay=document.createElement('div');
overlay.className='pf-overlay';

var banner=document.createElement('div');
banner.className='pf-banner';
banner.setAttribute('role','dialog');
banner.setAttribute('aria-label','Cookie consent');
banner.innerHTML='<div class="pf-inner">'
+'<div class="pf-text"><h3>${esc(c.headline)}</h3><p>${esc(c.description)}</p></div>'
+'<div class="pf-btns">'
+'<button class="pf-btn pf-btn-accept" id="pf-accept">${esc(c.acceptText)}</button>'
+'<button class="pf-btn pf-btn-reject" id="pf-reject">${esc(c.rejectText)}</button>'
+'<button class="pf-btn pf-btn-custom" id="pf-customize">${esc(c.customizeText)}</button>'
+'</div></div>';

document.body.appendChild(overlay);
document.body.appendChild(banner);

requestAnimationFrame(function(){
requestAnimationFrame(function(){
banner.classList.add('pf-show');
overlay.classList.add('pf-show');
});
});

document.getElementById('pf-accept').addEventListener('click',function(){
save({essential:true,analytics:true,marketing:true,functional:true});
close(banner,overlay);
});
document.getElementById('pf-reject').addEventListener('click',function(){
save({essential:true,analytics:false,marketing:false,functional:false});
close(banner,overlay);
});
document.getElementById('pf-customize').addEventListener('click',function(){
showModal(banner,overlay);
});
}

function showModal(banner,overlay){
var m=document.createElement('div');
m.className='pf-modal';
m.innerHTML='<h3>Cookie Preferences</h3>'
+cat('Essential','Required for the website to function properly. Cannot be disabled.','essential',true,true)
+cat('Analytics','Help us understand how visitors interact with our website.','analytics',false,false)
+cat('Marketing','Used to deliver relevant advertisements and track campaigns.','marketing',false,false)
+cat('Functional','Enable enhanced functionality like chat widgets and videos.','functional',false,false)
+'<div class="pf-modal-btns">'
+'<button class="pf-btn pf-btn-reject" id="pf-modal-reject">Reject All</button>'
+'<button class="pf-btn pf-btn-accept" id="pf-modal-save">Save Preferences</button>'
+'</div>';
document.body.appendChild(m);
requestAnimationFrame(function(){requestAnimationFrame(function(){m.classList.add('pf-show');});});

document.getElementById('pf-modal-save').addEventListener('click',function(){
var consent={essential:true};
['analytics','marketing','functional'].forEach(function(k){
var cb=m.querySelector('#pf-cat-'+k);
consent[k]=cb?cb.checked:false;
});
save(consent);
m.remove();
close(banner,overlay);
});
document.getElementById('pf-modal-reject').addEventListener('click',function(){
save({essential:true,analytics:false,marketing:false,functional:false});
m.remove();
close(banner,overlay);
});
}

function cat(name,desc,id,checked,disabled){
return '<div class="pf-cat"><div class="pf-cat-info"><div class="pf-cat-name">'+name+'</div><div class="pf-cat-desc">'+desc+'</div></div>'
+'<label class="pf-toggle"><input type="checkbox" id="pf-cat-'+id+'"'+(checked?' checked':'')+(disabled?' disabled':'')+'/><span></span></label></div>';
}

function close(banner,overlay){
banner.classList.remove('pf-show');
overlay.classList.remove('pf-show');
setTimeout(function(){banner.remove();overlay.remove();},400);
}

function save(consent){
var data={v:1,ts:Date.now(),consent:consent};
try{localStorage.setItem(PF_KEY,JSON.stringify(data));}catch(e){}
applyConsent(data);
fireEvent(data);
logConsent(consent);
}

function applyConsent(data){
var c=data.consent;
// Unblock scripts with data-consent-category
document.querySelectorAll('script[data-consent-category]').forEach(function(el){
var cat=el.getAttribute('data-consent-category');
if(c[cat]){
if(el.type==='text/plain'&&el.getAttribute('data-src')){
var ns=document.createElement('script');
ns.src=el.getAttribute('data-src');
el.parentNode.insertBefore(ns,el);
el.remove();
}
}
});
// Google Consent Mode v2
if(typeof gtag==='function'){
gtag('consent','update',{
ad_storage:c.marketing?'granted':'denied',
ad_user_data:c.marketing?'granted':'denied',
ad_personalization:c.marketing?'granted':'denied',
analytics_storage:c.analytics?'granted':'denied',
functionality_storage:c.functional?'granted':'denied',
personalization_storage:c.functional?'granted':'denied'
});
}
}

function fireEvent(data){
try{
var evt=new CustomEvent('policyforge:consent',{detail:data.consent});
document.dispatchEvent(evt);
}catch(e){}
}

function logConsent(consent){
var vid='';
try{vid=localStorage.getItem('pf_vid');if(!vid){vid=crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2);localStorage.setItem('pf_vid',vid);}}catch(e){vid='anon';}
try{
navigator.sendBeacon&&navigator.sendBeacon(
(document.currentScript&&document.currentScript.src?new URL(document.currentScript.src).origin:'')+'/api/consent',
JSON.stringify({bannerId:PF_SITE,visitorId:vid,consent:consent,country:null})
);
}catch(e){}
}

// Set default Google Consent Mode before banner loads
if(typeof window.dataLayer!=='undefined'||typeof gtag==='function'){
window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
gtag('consent','default',{
ad_storage:'denied',
ad_user_data:'denied',
ad_personalization:'denied',
analytics_storage:'denied',
functionality_storage:'denied',
personalization_storage:'denied',
wait_for_update:500
});
}

if(document.readyState==='loading'){
document.addEventListener('DOMContentLoaded',createBanner);
}else{
createBanner();
}
})();`;
}
