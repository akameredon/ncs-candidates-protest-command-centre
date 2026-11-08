import React,{useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL,key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const db=url&&key?createClient(url,key):null;
export default function PublicUpdates({mode}){
 const [rows,setRows]=useState([]);
 useEffect(()=>{if(!db)return;let alive=true;const load=async()=>{const q=mode==='route'?db.from('route_stops').select('id,position,title,place,note,latitude,longitude').eq('is_published',true).order('position') : db.from('announcements').select('id,title,body,published_at').eq('status','published').order('published_at',{ascending:false}).limit(5);const {data}=await q;if(alive&&data)setRows(data)};load();const channel=db.channel('public-'+mode).on('postgres_changes',{event:'*',schema:'public',table:mode==='route'?'route_stops':'announcements'},load).subscribe();return()=>{alive=false;db.removeChannel(channel)}},[mode]);
 if(!rows.length)return null;
 if(mode==='announcements')return <section className="live-updates"><p className="kicker">ORGANISER-PUBLISHED UPDATES</p>{rows.map(r=><article key={r.id}><small>{r.published_at?new Date(r.published_at).toLocaleString():'Campaign update'}</small><b>{r.title}</b><p>{r.body}</p></article>)}</section>;
 return <section className="live-route"><p className="kicker">LIVE PUBLISHED LANDMARKS</p>{rows.map(r=><article key={r.id}><b>{String(r.position).padStart(2,'0')} · {r.title}</b><span>{r.place}</span><p>{r.note}</p>{r.latitude!=null&&r.longitude!=null&&<a href={`https://www.openstreetmap.org/?mlat=${r.latitude}&mlon=${r.longitude}#map=17/${r.latitude}/${r.longitude}`} target="_blank" rel="noreferrer">Open verified landmark on map ↗</a>}</article>)}</section>;
}