import { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp, FileText, Package, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AgencyDropdown, Combo, Field, TextField } from './fields';
import { agvTotal, money, statuses, type Shipment, type CostLine } from '@/lib/owco';
const empty:Shipment={vase:'',vsub:'',status:'Shipment Created',ssub:'',rcv:'',eta:'',dos:'',pol:'',pod:'',shp:'',desc:'',dsub:'',agv:'0',gsm:'0',gsmd:'',bull:'0',bulld:'',tp:'0',sw:'0',inv:'',cha:'',agency:'',enhancement:'',netWeight:'0',liner:'',be:'',beDate:'',beType:'',note:''};
const newLine=():CostLine=>({id:crypto.randomUUID(),product:'',unit:'Cartons',quantity:'',cost:''});
export function ShipmentFields({form,setForm}:{form:Shipment;setForm:(value:Shipment)=>void}){
 const [expanded,setExpanded]=useState(false);
 const lines=form.breakdown||[];const agencies=form.agency?.split(', ').filter(Boolean)||[];
 const set=(key:keyof Shipment,value:string)=>setForm({...form,[key]:value});
 const setLines=(value:CostLine[])=>setForm({...form,breakdown:value});
 const combo=(label:string,key:keyof Shipment,options:string[])=><Combo label={label} value={String(form[key]||'')} onChange={v=>set(key,v)} options={options}/>;
 const text=(label:string,key:keyof Shipment,type='text',placeholder?:string,required=false)=><TextField label={label} value={String(form[key]||'')} onChange={v=>set(key,v)} type={type} placeholder={placeholder} required={required}/>;
 const updateLine=(id:string,key:keyof CostLine,value:string)=>setLines(lines.map(l=>l.id===id?{...l,[key]:value}:l));
 return <div className="form-grid shipment-fields">
 <div className="form-section-title"><Package/>Shipment information</div>
 {combo('Shipper Name','shp',['TFC','Arctic','Nargo','Rob','AFNL','Kam','WP','KonK'])}
 {combo('Receiver','rcv',['GMF','TFA','FIC','GBR','GFF'])}
 {combo('CHA Description','chaDescription',['Apple','Pears','Kiwi','Citrus','Grapes'])}
 {combo('CHA Status','status',statuses)}
 {text('Description','desc','text','Product description')}
 <Field label="AGV"><div className="input-action"><input aria-label="AGV" type="number" min="0" step="any" value={form.agv} onChange={e=>set('agv',e.target.value)}/><Button type="button" variant="ghost" size="icon" title="Compose AGV" aria-label="Compose AGV" onClick={()=>{setExpanded(v=>!v);if(!lines.length)setLines([newLine()])}}><Calculator size={16}/></Button></div></Field>
 {text('Net Weight','netWeight','number')}{text('ETA','eta','date')}
 {text('Dossier No','dos','text','Enter dossier number',true)}{text('Sales Invoice No','inv','text','e.g. OX/2026/060')}
 {combo('POL','pol',['BR','US','NZ','PL'])}{combo('POD','pod',['BOM','CHE','KOL','DEL'])}{combo('CHA User','cha',['MPT','InterlinkShipping','acnt'])}
 {combo('Liner','liner',['CMA','Hapag-Lloyd','Evergreen','OOCL','ONE','Maersk'])}{text('BL No','vsub','text','Enter bill of lading number')}{text('Vase / Container No','vase','text','e.g. SEGU9423661',true)}<Combo label="No. of Containers" value={form.containers||'1'} onChange={v=>set('containers',v)} options={Array.from({length:10},(_,i)=>String(i+1))}/>
 <div className="agv-breakdown"><Button type="button" variant="ghost" aria-expanded={expanded} className="breakdown-toggle" onClick={()=>setExpanded(v=>!v)}><span className="flex items-center gap-2"><Calculator size={14}/>AGV Composition <span className="count">{lines.length} items</span></span><span className="flex items-center gap-3">{money(agvTotal(lines))}{expanded?<ChevronUp size={15}/>:<ChevronDown size={15}/>}</span></Button>{expanded&&<div className="breakdown-body">{lines.map(line=><div className="cost-line" key={line.id}><TextField label="Product description" value={line.product} onChange={v=>updateLine(line.id,'product',v)} placeholder="e.g. Gala apples"/><Combo label="Unit" value={line.unit} onChange={v=>updateLine(line.id,'unit',v)} options={['Cartons','Kilograms','Pieces','Pallets']}/><TextField label="Quantity description" type="number" value={line.quantity} onChange={v=>updateLine(line.id,'quantity',v)} placeholder="Quantity"/><TextField label="Cost" type="number" value={line.cost} onChange={v=>updateLine(line.id,'cost',v)} placeholder="Unit cost"/><Button type="button" variant="ghost" size="icon" aria-label="Remove product" onClick={()=>setLines(lines.filter(x=>x.id!==line.id))}><Trash2 size={14}/></Button></div>)}<Button type="button" size="sm" variant="outline" onClick={()=>setLines([...lines,newLine()])}><Plus/>Add product</Button><div className="breakdown-total"><div><p>Total goods value</p><strong>{money(agvTotal(lines))}</strong></div><Button type="button" size="sm" variant="secondary" onClick={()=>{set('agv',agvTotal(lines).toFixed(2));setExpanded(false)}}><Save size={14}/>Apply total to AGV</Button></div></div>}</div>
 <div className="form-section-title"><FileText/>Clearance information</div>
 {text('BE No','be','text','Enter BE number')}{text('BE Date','beDate','date')}{combo('BE Type','beType',['Ass','Regular','Advance'])}
 <AgencyDropdown value={form.agency||''} onChange={v=>set('agency',v)}/>
 {agencies.includes('Enhancement')&&text('Enhancement amount','enhancement','number','Enter enhancement amount')}
 <Field label="Status Note" wide><textarea aria-label="Status Note" value={form.note||''} placeholder="Additional shipment notes" onChange={e=>set('note',e.target.value)}/></Field>
 <details className="field-wide financial-details"><summary>Financial reference & additional details</summary><div className="form-grid mt-5">{text('GSM','gsm','number')}{text('GSM Date','gsmd','date')}{text('Bull / OX','bull','number')}{text('OX Date','bulld','date')}{text('TP / TPT','tp','number')}{text('Sweet','sw','number')}{text('Description detail','dsub')}{text('Clearance reference','ssub')}</div></details>
 </div>;
}
export function ShipmentForm({open,onClose,onSave,shipment}:{open:boolean;onClose:()=>void;onSave:(v:Shipment)=>void;shipment?:Shipment}){
 const [form,setForm]=useState<Shipment>(()=>({...empty,...shipment}));const [error,setError]=useState('');
 return <Dialog open={open} onOpenChange={v=>{if(!v)onClose()}}><DialogContent className="shipment-dialog p-0 gap-0 flex flex-col overflow-hidden" aria-describedby="shipment-description"><div className="modal-top"><DialogTitle>{shipment?'Edit Shipment':'Add Shipment'}</DialogTitle><DialogDescription id="shipment-description">Shipment details, clearance information and goods value.</DialogDescription></div><form className="flex flex-col min-h-0" onSubmit={e=>{e.preventDefault();if(!form.vase.trim()||!form.dos.trim()){setError('Enter a container number and dossier number.');return}onSave(form);onClose()}}><div className="modal-body"><ShipmentFields form={form} setForm={setForm}/>{error&&<p role="alert" className="text-destructive mt-4">{error}</p>}</div><div className="modal-footer"><span>Required fields are marked with *</span><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit"><Save size={14}/>{shipment?'Save Changes':'Save Shipment'}</Button></div></form></DialogContent></Dialog>
}
