import { useState } from 'react';
import { ArrowLeft, Banknote, Eye, Landmark, Save, Church, Castle, Building } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { costFields, defaultCostConfig, estimateCosts } from '@/lib/owco-cost';
import { useWorkspace } from '@/lib/owco-workspace';
const hints:Record<string,string>={metrics:'Metrics factor (e.g. 0.5611)',bOffset:'Added to G_ex for B_ex (e.g. 0.30)',cOffset:'Added to G_ex for C_ex (e.g. 0.55)',dOffset:'Added to G_ex for D_ex (e.g. 3.50)',bc:'Fixed cost A',roh:'Fixed cost B',efc:'Fixed cost C',stt:'Fixed cost D',ofc:'Fixed cost LL',f:'Fixed cost F',chh:'Fixed cost G',h:'Fixed cost H',pq:'Chennai PQ Increment cost',mumbai:'Mumbai city-specific cost',delhi:'Delhi city-specific cost',bangalore:'Bangalore city-specific cost',chennai:'Chennai city-specific cost',viaChennai:'BLR alt route increment cost',min:'Slider minimum',max:'Slider maximum'};
const whole=(n:number)=>Math.round(n).toLocaleString('en-IN');
function Slider({label,value,set,min,max,step,ticks,prefix=''}:{label:string;value:number;set:(n:number)=>void;min:number;max:number;step:number;ticks:number[];prefix?:string}){
  return <div className="cc-slider"><div className="cc-slider-top"><span>{label}</span><input aria-label={label} type="number" value={value} step={step} min={min} max={max} onChange={e=>set(Number(e.target.value))}/></div><input aria-label={`${label} slider`} type="range" min={min} max={max} step={step} value={value} onChange={e=>set(Number(e.target.value))}/><div className="cc-ticks">{ticks.map(t=><button type="button" key={t} className={t===value?'on':''} onClick={()=>set(t)}>{prefix}{t}</button>)}</div></div>;
}
export function CostCalculator(){const {preferences,setPreferences}=useWorkspace();const [config,setConfig]=useState(defaultCostConfig);const [editing,setEditing]=useState(false);const [rateEdit,setRateEdit]=useState(false);const [cartons,setCartons]=useState(1029);const [weight,setWeight]=useState(17.5);const [price,setPrice]=useState(20);const visible=true;const rate=Number(preferences.rate)||0;const e=estimateCosts(config,cartons,weight,price,rate);const show=(n:number)=>visible?whole(n):'••••';
  if(editing)return <form className="cfg-wrap" onSubmit={ev=>{ev.preventDefault();if(config.min>=config.max){toast.error('Minimum price must be below maximum price');return}setPrice(p=>Math.min(config.max,Math.max(config.min,p)));setEditing(false);toast.success('Cost configuration saved')}}><div className="cfg-head"><button type="button" className="cfg-back" aria-label="Back to cost calculator" onClick={()=>setEditing(false)}><ArrowLeft size={18}/></button><div><span className="cfg-chip"><i/>OWCO.AI</span><h2>Cost Configuration</h2><p>Formula inputs · G_ex fetched live</p></div></div><div className="cfg-card">{costFields.map(([key,label])=><label className="cfg-row" key={key}><span><b>{label}</b><small>{hints[key]}</small></span><input aria-label={label} type="number" step="any" value={String(config[key])} onChange={ev=>setConfig(c=>({...c,[key]:Number(ev.target.value)}))}/></label>)}<Button type="submit" className="cfg-save"><Save/>Save Configuration</Button></div></form>;
  const purchase=price*cartons*rate;const landed=e.Mumbai*cartons;
  return <div className="cc-wrap">
    <div className="cc-head"><p>Check if you get the bang for your buck</p><div className="cc-rate">USD/INR: {rateEdit?<input aria-label="USD/INR rate" type="number" step="any" autoFocus value={preferences.rate} onChange={ev=>setPreferences({...preferences,rate:ev.target.value})} onBlur={()=>setRateEdit(false)} onKeyDown={ev=>{if(ev.key==='Enter')setRateEdit(false)}}/>:<b>{rate.toFixed(4)}</b>}<button type="button" onClick={()=>setRateEdit(v=>!v)}>edit</button></div><div className="cc-head-actions"><Button variant="outline" size="icon" aria-label="View cost configuration" title="Cost configuration" onClick={()=>setEditing(true)}><Eye/></Button></div></div>
    <div className="cc-card"><Slider label="CARTONS / FCL" value={cartons} set={setCartons} min={1029} max={1176} step={1} ticks={[1029,1049,1160,1176]}/><Slider label="KG / CARTON" value={weight} set={setWeight} min={17.5} max={20} step={.5} ticks={[17.5,18,19.5,20]}/><Slider label="$" value={price} set={setPrice} min={config.min} max={config.max} step={.1} ticks={[config.min,(config.min+config.max)/2,config.max]} prefix="$"/></div>
    <div className="cc-cities">
      <div className="cc-city mum"><Landmark/><h3>MUM</h3><strong>{show(e.Mumbai)}</strong><small>Direct POD</small></div>
      <div className="cc-city chn"><Church/><h3>CHN</h3><strong>{show(e.Chennai)}</strong><small>Direct POD</small></div>
      <div className="cc-city del"><Castle/><h3>DEL</h3><strong>{show(e.Delhi)}</strong><small>via MUM</small></div>
      <div className="cc-city blr"><Building/><h3>BLR</h3><strong>{show(e.Bangalore)}</strong><small>via MUM</small><hr/><strong>{show(e['Bangalore via Chennai'])}</strong><small>via CHN</small></div>
      <div className="cc-note">* Varies <b>±75</b> by membership tier.</div>
    </div>
    <div className="cc-plan"><span>PLAN APPROX. HONEY &amp; MONEY PER FCL</span><div><i><Landmark size={16}/></i><b>{show(purchase)}</b><em/><i className="green"><Banknote size={16}/></i><b className="green">{show(landed-purchase)}</b></div></div>
    <p className="cc-disclaimer">Preview estimates — original pricing formula not supplied.</p>
  </div>;
}
