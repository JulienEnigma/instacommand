
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, MapPin, Tag } from 'lucide-react';

interface Target {
  username: string;
  bio: string;
  location: string;
  country: string;
  continent: string;
  strategy: string;
  status: 'queued' | 'active' | 'completed';
  followBackChance: number;
  storyDMOpen: 'High' | 'Medium' | 'Low';
  tagsMatched: number;
  totalTags: number;
  userTags: string[];
}

export const TargetIntelligence = () => {
  const [targets, setTargets] = useState<Target[]>([
    {
      username: '@julien_film',
      bio: 'Film director, visual storyteller',
      location: 'Los Angeles, CA',
      country: 'USA',
      continent: 'North America',
      strategy: 'FOLLOW + STORY_VIEW',
      status: 'active',
      followBackChance: 81,
      storyDMOpen: 'Medium',
      tagsMatched: 4,
      totalTags: 5,
      userTags: ['Filmmaker', 'High-value']
    },
    {
      username: '@alice.k',
      bio: 'Creative photographer, coffee enthusiast',
      location: 'Brooklyn, NY',
      country: 'USA',
      continent: 'North America',
      strategy: 'STORY_VIEW + DM',
      status: 'queued',
      followBackChance: 67,
      storyDMOpen: 'High',
      tagsMatched: 3,
      totalTags: 5,
      userTags: ['Photographer']
    },
    {
      username: '@filmfest.mythos',
      bio: 'Independent film festival curator',
      location: 'Austin, TX',
      country: 'USA',
      continent: 'North America',
      strategy: 'FOLLOW + ENGAGE',
      status: 'completed',
      followBackChance: 92,
      storyDMOpen: 'Low',
      tagsMatched: 5,
      totalTags: 5,
      userTags: ['Festival', 'High-value', 'Curator']
    },
    {
      username: '@urban_lens',
      bio: 'Street photography, urban exploration',
      location: 'Berlin, DE',
      country: 'Germany',
      continent: 'Europe',
      strategy: 'FOLLOW',
      status: 'queued',
      followBackChance: 74,
      storyDMOpen: 'Medium',
      tagsMatched: 2,
      totalTags: 5,
      userTags: ['Photographer', 'European']
    }
  ]);

  const [geoFilter, setGeoFilter] = useState<'all' | 'nearby' | 'continent'>('all');

  useEffect(() => {
    // Mock target updates
    const interval = setInterval(() => {
      setTargets(prev => prev.map(target => 
        Math.random() > 0.9 ? 
          { ...target, status: target.status === 'queued' ? 'active' : target.status } : 
          target
      ));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600/30 text-green-300 border-green-600';
      case 'completed': return 'bg-blue-600/30 text-blue-300 border-blue-600';
      case 'queued': return 'bg-yellow-600/30 text-yellow-300 border-yellow-600';
      default: return 'bg-gray-600/30 text-gray-300 border-gray-600';
    }
  };

  const getStoryDMColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const filteredTargets = targets.filter(target => {
    if (geoFilter === 'all') return true;
    if (geoFilter === 'nearby') return target.country === 'USA'; // Mock nearby countries
    if (geoFilter === 'continent') return target.continent === 'North America';
    return true;
  });

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-red-500" />
            TARGET INTELLIGENCE
          </div>
          <div className="flex space-x-1">
            {['all', 'nearby', 'continent'].map((filter) => (
              <Button
                key={filter}
                size="sm"
                variant={geoFilter === filter ? 'default' : 'outline'}
                onClick={() => setGeoFilter(filter as any)}
                className={`text-xs ${
                  geoFilter === filter 
                    ? 'bg-red-700 text-white' 
                    : 'bg-black/40 border-red-800/30 text-red-400 hover:bg-red-900/30'
                }`}
              >
                {filter === 'nearby' ? '🌍' : filter === 'continent' ? '🗺️' : ''}
                {filter.toUpperCase()}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-4">
            {filteredTargets.map((target, index) => (
              <div key={index} className="p-3 bg-red-950/20 border border-red-800/30 rounded animate-fade-in">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-red-300 break-all">{target.username}</span>
                  <Badge className={`${getStatusColor(target.status)} text-xs border`}>
                    {target.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="text-xs space-y-2">
                  <div className="text-red-400/70 break-words">{target.bio}</div>
                  
                  <div className="flex items-center text-red-500/70">
                    <MapPin className="h-3 w-3 mr-1" />
                    {target.location}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Follow-back chance:</span>
                      <span className="text-green-400 font-bold ml-1">{target.followBackChance}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Story DM open:</span>
                      <span className={`${getStoryDMColor(target.storyDMOpen)} font-bold ml-1`}>
                        {target.storyDMOpen}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs">
                    <span className="text-gray-500">Tags matched:</span>
                    <span className="text-cyan-400 font-bold ml-1">
                      {target.tagsMatched}/{target.totalTags}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {target.userTags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex}
                        className="bg-purple-600/20 text-purple-300 border-purple-600/50 text-xs"
                      >
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-yellow-400 font-mono break-words text-xs">
                    → {target.strategy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
