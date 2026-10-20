import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/settings')({
 head: () => ({meta:[{title:'Settings | OWCO.ai'},{name:'description',content:'Workspace preferences, exchange rates and notifications.'},{property:'og:title',content:'Settings | OWCO.ai'},{property:'og:description',content:'Workspace preferences, exchange rates and notifications.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component: () => null,
});
