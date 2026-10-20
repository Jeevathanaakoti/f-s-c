import type { Shipment } from './owco';

/** ETA buckets share a boundary without double counting day 14. */
export function shipmentMetrics(active:Shipment[], master:Shipment[], today:string) {
  const start=Date.parse(`${today}T00:00:00Z`);
  let nextWeek=0;
  let followingWeek=0;
  for(const shipment of active) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(shipment.eta)) continue;
    const days=(Date.parse(`${shipment.eta}T00:00:00Z`)-start)/86400000;
    if(days>=7&&days<14) nextWeek++;
    if(days>=14&&days<=21) followingWeek++;
  }
  return {active:active.length,total:new Set([...active,...master].map(s=>s.vase)).size,nextWeek,followingWeek};
}