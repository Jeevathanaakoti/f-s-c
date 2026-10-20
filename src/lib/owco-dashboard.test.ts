import { describe, expect, it } from 'vitest';
import { initialActive, initialMaster, type Shipment } from './owco';
import { shipmentMetrics } from './owco-dashboard';

const base=initialActive[0] as Shipment;
const row=(vase:string,eta:string):Shipment=>({...base,vase,eta});

describe('consistent CHA shipment metrics',()=>{
  it('counts the same active records as the shipment table',()=>{
    expect(shipmentMetrics(initialActive,initialMaster,'2026-10-20').active).toBe(initialActive.length);
    const added=row('TEST123','2026-10-27');
    expect(shipmentMetrics([...initialActive,added],initialMaster,'2026-10-20').active).toBe(initialActive.length+1);
  });
  it('counts unique containers across active and master records',()=>{
    const first=row('ONE','2026-10-27');
    expect(shipmentMetrics([first],[first,row('TWO','2026-10-27')],'2026-10-20').total).toBe(2);
  });
  it('counts 7–14 day arrivals without double counting day 14',()=>{
    const rows=[6,7,13,14,21,22].map((days,i)=>row(String(i),new Date(Date.UTC(2026,9,20+days)).toISOString().slice(0,10)));
    expect(shipmentMetrics(rows,[],'2026-10-20')).toMatchObject({nextWeek:2,followingWeek:2});
  });
  it('updates ETA totals when a saved shipment changes and ignores missing dates',()=>{
    const shipment=row(base.vase,'2026-10-27');
    expect(shipmentMetrics([shipment],[],'2026-10-20').nextWeek).toBe(1);
    expect(shipmentMetrics([row(base.vase,'2026-11-03'),row('NO-ETA','')],[],'2026-10-20')).toMatchObject({nextWeek:0,followingWeek:1});
  });
});