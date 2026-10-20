import { reservedTpt, type Shipment } from './owco';
export type LedgerEntry={id:string;date:string;description:string;reference:string;type:string;debit:number;credit:number;shipper?:string;file?:string;eta?:string;agv?:string;via?:string};
export const initialLedgerEntries:LedgerEntry[]=[{id:'1',date:'2026-06-11',description:'Pink Lady · 3 containers',reference:'PI 4496 / 4555',type:'AGV charge',debit:95256,credit:0},{id:'2',date:'2026-06-11',description:'GSM advance · Payment 1',reference:'GSM-2026-0611',type:'GSM advance',debit:0,credit:31752},{id:'3',date:'2026-06-12',description:'Transfer via KAM',reference:'TPT-KAM-0612',type:'TPT (Transfer)',debit:0,credit:15876},{id:'4',date:'2026-06-22',description:'Sparkle · 3 containers',reference:'PI 000 / 4662',type:'AGV charge',debit:83944,credit:0},{id:'5',date:'2026-06-22',description:'GSM advance · Payment 1',reference:'GSM-2026-0622',type:'GSM advance',debit:0,credit:28802},{id:'6',date:'2026-06-23',description:'Transfer via VG',reference:'TPT-VG-0623',type:'TPT (Transfer)',debit:0,credit:11695},{id:'7',date:'2026-06-29',description:'Sparkle · PI 4700',reference:'PI 4700',type:'AGV charge',debit:87378,credit:0},{id:'8',date:'2026-06-29',description:'GSM advance · Payment 1',reference:'GSM-2026-0629',type:'GSM advance',debit:0,credit:29571},{id:'9',date:'2026-06-30',description:'Transfer via KAM',reference:'TPT-KAM-0630',type:'TPT (Transfer)',debit:0,credit:14118}];

export const transferTotal=(entries:LedgerEntry[])=>entries.filter(e=>e.type==='TPT (Transfer)').reduce((sum,e)=>sum+e.credit,0);
export const availableTpt=(entries:LedgerEntry[],shipments:Shipment[],current:string)=>Math.max(0,transferTotal(entries)-shipments.filter(s=>s.vase!==current).reduce((sum,s)=>sum+Number(s.tptReserved||0),0));
export function paymentTotals(agv:number,paid:number,reserved:number){return {paid,reserved,total:paid+reserved,remaining:Math.max(0,agv-paid-reserved)};}
export const reservationAmount=(available:number,mode:'full'|'partial',partial:number)=>reservedTpt(available,mode,partial);
export const transferEntries=(entries:LedgerEntry[])=>entries.filter(e=>e.type==='TPT (Transfer)');
export const reservedFromLedger=(saved:number|null,available:number)=>saved===null?available:saved;
export const latestTransferAmount=(entries:LedgerEntry[])=>{const last=transferEntries(entries).at(-1);return last?Number(last.credit)||0:0;};
export const transferForFile=(entries:LedgerEntry[],file:string)=>transferEntries(entries).filter(e=>e.file===file).at(-1);
export const shipperOptions=(shipments:Shipment[])=>[...new Set(shipments.map(s=>s.shp).filter(Boolean))].sort();
export const shipmentForShipper=(shipments:Shipment[],shipper:string)=>shipments.find(s=>s.shp===shipper);
export const shipmentsForShipper=(shipments:Shipment[],shipper:string,shipperName='')=>shipments.filter(s=>s.shp===shipper||(Boolean(shipperName)&&s.shp===shipperName));
