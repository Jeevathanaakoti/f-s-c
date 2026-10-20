import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/master-records')({
 head: () => ({meta:[{title:'Master Records | OWCO.ai'},{name:'description',content:'Review delivered shipments, payments and TPT reservations.'},{property:'og:title',content:'Master Records | OWCO.ai'},{property:'og:description',content:'Review delivered shipments, payments and TPT reservations.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component: () => null,
});
