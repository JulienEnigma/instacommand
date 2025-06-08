
import { useState, useEffect } from 'react';
import { Campaign } from './types';
import { generateVerdict } from './utils';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Operation: Ghost Reach',
      codename: 'GHOST_REACH',
      status: 'active',
      progress: 67,
      timeRemaining: '02:14:33',
      target: 100,
      current: 67,
      description: '100 new followers from film niche'
    },
    {
      id: '2',
      name: 'Operation: Shadow Network',
      codename: 'SHADOW_NET',
      status: 'scheduled',
      progress: 0,
      timeRemaining: '06:00:00',
      target: 50,
      current: 0,
      description: 'High-value photographer targets'
    },
    {
      id: '3',
      name: 'Operation: Street Vision',
      codename: 'STREET_VISION',
      status: 'completed',
      progress: 100,
      timeRemaining: '00:00:00',
      target: 75,
      current: 75,
      description: 'Urban photographers engagement',
      completedAt: '14:23:12',
      verdict: 'Great conversion. Suggest reusing comment strategy.'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prev => prev.map(campaign => {
        if (campaign.status === 'active' && campaign.progress < 100) {
          const newProgress = Math.min(campaign.progress + Math.random() * 2, 100);
          const newCurrent = Math.floor((newProgress / 100) * campaign.target);
          
          if (newProgress >= 100) {
            return {
              ...campaign,
              progress: 100,
              current: campaign.target,
              status: 'completed' as const,
              completedAt: new Date().toLocaleTimeString('en-US', { hour12: false }),
              verdict: generateVerdict()
            };
          }
          
          return {
            ...campaign,
            progress: newProgress,
            current: newCurrent
          };
        }
        return campaign;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const archiveCampaign = (id: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id ? { ...campaign, status: 'archived' as const } : campaign
    ));
  };

  const pauseCampaign = (id: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id ? { 
        ...campaign, 
        status: campaign.status === 'paused' ? 'active' : 'paused' 
      } : campaign
    ));
  };

  const duplicateCampaign = (campaign: Campaign) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      codename: `${campaign.codename}_COPY`,
      status: 'scheduled',
      progress: 0,
      current: 0,
      completedAt: undefined,
      verdict: undefined
    };
    setCampaigns(prev => [...prev, newCampaign]);
  };

  return {
    campaigns,
    archiveCampaign,
    pauseCampaign,
    duplicateCampaign
  };
};
