import { describe, expect, it } from 'vitest';
import { costFields, defaultCostConfig, estimateCosts } from './owco-cost';
describe('Screenshot cost configuration',()=>{
 it('includes all twenty configuration inputs',()=>expect(costFields).toHaveLength(20));
 it('uses the screenshot metrics and offsets',()=>expect(defaultCostConfig).toMatchObject({metrics:3.5611,bOffset:.3,cOffset:.55,dOffset:3.5}));
 it('uses the screenshot location amounts',()=>expect(defaultCostConfig).toMatchObject({pq:7100,mumbai:1000,delhi:1001,bangalore:1,chennai:17500,viaChennai:50000}));
 it('uses the screenshot purchase price range',()=>expect([defaultCostConfig.min,defaultCostConfig.max]).toEqual([12,55]));
 it('recalculates estimates when configuration changes',()=>{const before=estimateCosts(defaultCostConfig,1000,17.5,20,83.01);const after=estimateCosts({...defaultCostConfig,mumbai:2000},1000,17.5,20,83.01);expect(after.Mumbai-before.Mumbai).toBe(1);});
});