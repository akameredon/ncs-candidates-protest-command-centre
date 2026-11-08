import React,{useEffect,useRef,useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {createClient} from '@supabase/supabase-js';

const url=import.meta.env.VITE_SUPABASE_URL,key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const db=url&&key?createClient(url,key):null;
const abujaView=[9.0579,7.4951];

export default function InteractiveRouteMap(){
 const element=useRef(null),map=useRef(null),layer=useRef(null);
 const [status,setStatus]=useState('Loading organiser-published landmarks…');
 const [count,setCount]=useState(0);
 useEffect(()=>{
  if(!element.current)return;
  const instance=L.map(element.current,{scrollWheelZoom:false}).setView(abujaView,12);
  map.current=instance;
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'}).addTo(instance);
  layer.current=L.layerGroup().addTo(instance);
  const refresh=async()=>{
   if(!db){setStatus('The live map is not connected yet.');return}
   const {data,error}=await db.from('route_stops').select('id,position,title,place,note,latitude,longitude').eq('is_published',true).order('position');
   if(error){setStatus('Could not load published landmarks. Please try again later.');return}
   const valid=(data||[]).filter(s=>Number.isFinite(Number(s.latitude))&&Number.isFinite(Number(s.longitude))&&s.latitude!==null&&s.longitude!==null&&Math.abs(Number(s.latitude))<=90&&Math.abs(Number(s.longitude))<=180);
   layer.current.clearLayers();
   valid.forEach(s=>{
    const marker=L.circleMarker([Number(s.latitude),Number(s.longitude)],{radius:8,color:'#172941',weight:2,fillColor:'#f1c65c',fillOpacity:1}).addTo(layer.current);
    marker.bindPopup('<strong>'+escapeText(s.title||'Published landmark')+'</strong><br>'+escapeText(s.place||'')+(s.note?'<br>'+escapeText(s.note):''));
   });
   setCount(valid.length);
   setStatus(valid.length?valid.length+' organiser-published landmark'+(valid.length===1?'':'s')+' with coordinates.':'No exact landmarks have been published yet. The map shows Abuja at city level only.');
   if(valid.length){const bounds=L.latLngBounds(valid.map(s=>[Number(s.latitude),Number(s.longitude)]));instance.fitBounds(bounds.pad(0.18),{maxZoom:15})}
   else instance.setView(abujaView,12);
  };
  refresh();
  const channel=db?.channel('public-route-map').on('postgres_changes',{event:'*',schema:'public',table:'route_stops'},refresh).subscribe();
  const resize=()=>instance.invalidateSize();
  window.addEventListener('resize',resize);
  return()=>{window.removeEventListener('resize',resize);if(channel)db.removeChannel(channel);instance.remove();map.current=null};
 },[]);
 return <section className="route-map-wrap" aria-label="Interactive map of organiser-published route landmarks">
  <div className="route-map-head"><h3>Interactive Abuja map</h3><p>Pan and zoom to explore. Markers appear only when an organiser publishes exact landmark coordinates.</p></div>
  <div className="route-map" ref={element}/>
  <div className="route-map-status" aria-live="polite">{status}</div>
  <div className="route-map-foot">Map data &copy; OpenStreetMap contributors. This is not live navigation, a verified march route or a security map. No route line is drawn. Confirm access and stopping points with organisers.</div>
 </section>;
}
function escapeText(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
