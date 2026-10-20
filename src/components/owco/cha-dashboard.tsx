import { ArrowUp, CalendarDays, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Shipment } from '@/lib/owco';
import { shipmentMetrics } from '@/lib/owco-dashboard';
import './cha-dashboard.css';

export function ChaDashboard({rows,masterRows,onShipments}:{rows:Shipment[];masterRows:Shipment[];onShipments:()=>void}) {
  const [today,setToday]=useState('');
  useEffect(()=>{
    const refresh=()=>{const now=new Date();setToday(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`)};
    refresh();
    const timer=window.setInterval(refresh,60000);
    return ()=>window.clearInterval(timer);
  },[]);
  const metrics=shipmentMetrics(rows,masterRows,today);
  return <div className="cha-metrics">
    <Button variant="ghost" className="cha-metric cha-metric-active" aria-label="Active shipments — open active shipments" onClick={onShipments}>
      <span className="cha-metric-label">ACTIVE SHIPMENTS</span>
      <span className="cha-metric-icon"><ShoppingCart size={22}/></span>
      <span className="cha-metric-value"><em>{metrics.active}</em><span>/</span>{metrics.total}</span>
      <span className="cha-metric-foot">{metrics.total} total shipments</span>
    </Button>
    <Button variant="ghost" className="cha-metric cha-metric-next" aria-label="Next week ETA — open active shipments" onClick={onShipments}>
      <span className="cha-metric-label">NEXT WEEK ETA</span>
      <span className="cha-metric-icon"><CalendarDays size={22}/></span>
      <span className="cha-metric-value"><em>{metrics.nextWeek}</em></span>
      <span className="cha-metric-foot"><ArrowUp size={10}/>Arriving in 7–14 days</span>
    </Button>
    <Button variant="ghost" className="cha-metric cha-metric-following" aria-label="Following week ETA — open active shipments" onClick={onShipments}>
      <span className="cha-metric-label">FOLLOWING WEEK ETA</span>
      <span className="cha-metric-icon"><CalendarDays size={22}/></span>
      <span className="cha-metric-value"><em>{metrics.followingWeek}</em></span>
      <span className="cha-metric-foot"><ArrowUp size={10}/>Arriving in 14–21 days</span>
    </Button>
  </div>;
}