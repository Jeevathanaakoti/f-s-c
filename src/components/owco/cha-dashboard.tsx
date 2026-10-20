import { ArrowUp, CalendarDays, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './cha-dashboard.css';

export function ChaDashboard({onShipments}:{onShipments:()=>void}) {
  return <div className="cha-metrics">
    <Button variant="ghost" className="cha-metric cha-metric-active" aria-label="Active shipments — open active shipments" onClick={onShipments}>
      <span className="cha-metric-label">ACTIVE SHIPMENTS</span>
      <span className="cha-metric-icon"><ShoppingCart size={22}/></span>
      <span className="cha-metric-value"><em>9</em><span>/</span>141</span>
      <span className="cha-metric-foot"><ArrowUp size={10}/>+10% from last month</span>
    </Button>
    <Button variant="ghost" className="cha-metric cha-metric-next" aria-label="Next week ETA — open active shipments" onClick={onShipments}>
      <span className="cha-metric-label">NEXT WEEK ETA</span>
      <span className="cha-metric-icon"><CalendarDays size={22}/></span>
      <span className="cha-metric-value"><em>0</em></span>
      <span className="cha-metric-foot"><ArrowUp size={10}/>Arriving in 7–14 days</span>
    </Button>
    <Button variant="ghost" className="cha-metric cha-metric-following" aria-label="Following week ETA — open active shipments" onClick={onShipments}>
      <span className="cha-metric-label">FOLLOWING WEEK ETA</span>
      <span className="cha-metric-icon"><CalendarDays size={22}/></span>
      <span className="cha-metric-value"><em>0</em></span>
      <span className="cha-metric-foot"><ArrowUp size={10}/>Arriving in 14–21 days</span>
    </Button>
  </div>;
}