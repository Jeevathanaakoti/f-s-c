import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/shipments')({
 head: () => ({meta:[{title:'Active Shipments | OWCO.ai'},{name:'description',content:'Track and manage active shipments, goods values and clearance documents.'},{property:'og:title',content:'Active Shipments | OWCO.ai'},{property:'og:description',content:'Track and manage active shipments, goods values and clearance documents.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component: () => null,
});
