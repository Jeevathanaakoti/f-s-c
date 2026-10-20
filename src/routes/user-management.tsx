import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/user-management')({
 head: () => ({meta:[{title:'User Management | OWCO.ai'},{name:'description',content:'Manage OWCO workspace members and their details.'},{property:'og:title',content:'User Management | OWCO.ai'},{property:'og:description',content:'Manage OWCO workspace members and their details.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component: () => null,
});
