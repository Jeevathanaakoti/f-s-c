import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/cha-user')({
 head: () => ({meta:[{title:'CHA User | OWCO.ai'},{name:'description',content:'Review clearance assignments and shipment documentation.'},{property:'og:title',content:'CHA User | OWCO.ai'},{property:'og:description',content:'Review clearance assignments and shipment documentation.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component: () => null,
});
