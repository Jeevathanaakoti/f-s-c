import { describe, expect, it } from 'vitest';
import { initialActive, initialMaster } from './owco';
import { shipmentMetrics } from './owco-dashboard';

describe('consistent CHA shipment metrics',()=>{
  it('counts the same active records as the shipment table',()=>{
    expect(shipmentMetrics(initialActive,initialMaster,'2026-10-20').active).toBe(initialActive.length);
    const added={...initialActive[0],vase:'TEST123',eta:'2026-10-27'};
    expect(shipmentMetrics([...initialActive,added],initialMaster,'2026-10-20').active).toBe(initialActive.length+1);
  });
  it('counts unique containers across active and master records',()=>{
    const first={...initialActive[0],vase:'ONE',eta:'2026-10-27'};
    expect(shipmentMetrics([first],[first,{...first,vase:'TWO'}],'2026-10-20').total).toBe(2);
  });
  it('counts 7–14 day arrivals without double counting day 14',()=>{
    const rows=[6,7,13,14,21,22].map((days,i)=>({...initialActive[0],vase:String(i),eta:new Date(Date.UTC(2026,9,20+days)).toISOString().slice(0,10)}));
    expect(shipmentMetrics(rows,[],'2026-10-20')).toMatchObject({nextWeek:2,followingWeek:2});
  });
  it('updates ETA totals when a saved shipment changes and ignores missing dates',()=>{
    const row={...initialActive[0],eta:'2026-10-27'};
    expect(shipmentMetrics([row],[],'2026-10-20').nextWeek).toBe(1);
    expect(shipmentMetrics([{...row,eta:'2026-11-03'},{...row,eta:''}],[],'2026-10-20')).toMatchObject({nextWeek:0,followingWeek:1});
  });
});