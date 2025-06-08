
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crosshair, Archive } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useCampaigns } from './campaign/useCampaigns';
import { CampaignList } from './campaign/CampaignList';

export const CampaignMode = () => {
  const { toast } = useToast();
  const { campaigns, archiveCampaign, pauseCampaign, duplicateCampaign } = useCampaigns();
  const [showArchived, setShowArchived] = useState(false);

  const handleArchive = (id: string) => {
    archiveCampaign(id);
    toast({
      title: "Campaign Archived",
      description: "Campaign moved to archive successfully.",
    });
  };

  const handleDuplicate = (campaign: any) => {
    duplicateCampaign(campaign);
    toast({
      title: "Campaign Duplicated",
      description: `Created copy of ${campaign.name}`,
    });
  };

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold tracking-wider flex items-center">
            <Crosshair className="mr-2 h-5 w-5 text-red-500" />
            CAMPAIGN OPERATIONS
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
            className="bg-black/40 border-red-800/30 text-red-400 hover:bg-red-900/30 text-xs"
          >
            <Archive className="mr-1 h-3 w-3" />
            {showArchived ? 'ACTIVE' : 'ARCHIVE'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CampaignList
          campaigns={campaigns}
          showArchived={showArchived}
          onArchive={handleArchive}
          onPause={pauseCampaign}
          onDuplicate={handleDuplicate}
        />
      </CardContent>
    </Card>
  );
};
