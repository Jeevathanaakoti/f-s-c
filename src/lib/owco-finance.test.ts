import { describe,it,expect } from 'vitest';
import { availableTpt,initialLedgerEntries,latestTransferAmount,paymentTotals,reservationAmount,reservedFromLedger,transferEntries,transferForFile,transferTotal,type LedgerEntry } from './owco-finance';
import { initialMaster,initialActive } from './owco';
describe('Connected ledger payments',()=>{
it('preserves the first screenshot shipment values',()=>expect(initialActive.find(s=>s.vase==='HLBU9787118')).toMatchObject({shp:'TFC',rcv:'GMF',chaDescription:'XF',liner:'OOCL',agv:'25401.6',netWeight:'21168',dos:'62470',be:'9466051'}));
const entries:LedgerEntry[]=[{id:'test',date:'2026-10-16',description:'Transfer',reference:'TPT-1',type:'TPT (Transfer)',debit:0,credit:1000}];
it('makes an added ledger transfer available for payments',()=>expect(transferTotal(entries)).toBe(1000));
it('uses the full available TPT amount',()=>expect(reservationAmount(1000,'full',200)).toBe(1000));
it('uses only the entered partial TPT amount',()=>expect(reservationAmount(1000,'partial',200)).toBe(200));
it('includes saved TPT in Total and Remaining',()=>expect(paymentTotals(25401.6,11318.8,1000)).toEqual({paid:11318.8,reserved:1000,total:12318.8,remaining:13082.8}));
it('shows an added ledger transfer as the TPT Reserved Amount before anything is saved',()=>expect(reservedFromLedger(null,20000)).toBe(20000));
it('keeps a saved reservation as the TPT Reserved Amount',()=>expect(reservedFromLedger(5000,20000)).toBe(5000));
it('keeps a saved zero reservation at zero instead of falling back to the ledger',()=>expect(reservedFromLedger(0,20000)).toBe(0));
it('lists only TPT transfers as the ledger source',()=>expect(transferEntries([...entries,{id:'charge',date:'2026-10-16',description:'Pink Lady',reference:'PI 4496',type:'AGV charge',debit:500,credit:0}]).map(e=>e.reference)).toEqual(['TPT-1']));
it('does not use a transfer twice across shipments',()=>{const shipment=initialMaster[0];if(!shipment)throw new Error('Missing sample shipment');expect(availableTpt(entries,[{...shipment,vase:'other',tptReserved:'200'}],'current')).toBe(800)});
it('shows the newest ledger transfer amount, not the whole pool',()=>expect(latestTransferAmount([...entries,{id:'later',date:'2026-10-17',description:'Transfer',reference:'TPT-2',type:'TPT (Transfer)',debit:0,credit:26000}])).toBe(26000));
it('reads the newest transfer from the sample ledger',()=>expect(latestTransferAmount(initialLedgerEntries)).toBe(14118));
it('shows nothing reserved when the ledger has no transfer',()=>expect(latestTransferAmount([])).toBe(0));
it('finds the transfer allotted to a shipment file',()=>expect(transferForFile([{id:'f',date:'2026-10-16',description:'Transfer',reference:'TPT-9',type:'TPT (Transfer)',debit:0,credit:8000,file:'62470'}],'62470')?.credit).toBe(8000));
it('returns nothing when no transfer matches the file',()=>expect(transferForFile(entries,'62470')).toBeUndefined());

});
