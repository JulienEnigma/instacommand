
import React from 'react';
import { Campaign } from './types';
import { CampaignItem } from './CampaignItem';

interface CampaignListProps {
  campaigns: Campaign[];
  showArchived: boolean;
  onArchive: (id: string) => void;
  onPause: (id: string) => void;
  onDuplicate: (campaign: Campaign) => void;
}

export const CampaignList = ({ 
  campaigns, 
  showArchived, 
  onArchive, 
  onPause, 
  onDuplicate 
}: CampaignListProps) => {
  const activeCampaigns = campaigns.filter(c => c.status !== 'archived');
  const archivedCampaigns = campaigns.filter(c => c.status === 'archived');
  
  const displayCampaigns = showArchived ? archivedCampaigns : activeCampaigns;

  return (
    <div className="space-y-4">
      {displayCampaigns.map((campaign) => (
        <CampaignItem
          key={campaign.id}
          campaign={campaign}
          onArchive={onArchive}
          onPause={onPause}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
};
