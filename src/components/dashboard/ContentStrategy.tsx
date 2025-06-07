
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Hash, Calendar, Zap, Copy, RefreshCw } from 'lucide-react';
import { toast } from "sonner";

const contentIdeas = [
  {
    type: "Tutorial",
    title: "Behind-the-scenes workflow optimization",
    hashtags: ["#productivity", "#workflow", "#tech", "#entrepreneur"],
    engagement: "High",
    color: "bg-green-500"
  },
  {
    type: "Question",
    title: "What's your biggest productivity challenge?",
    hashtags: ["#question", "#community", "#productivity", "#growth"],
    engagement: "Medium",
    color: "bg-blue-500"
  },
  {
    type: "Inspiration",
    title: "Daily wins and breakthrough moments",
    hashtags: ["#motivation", "#success", "#mindset", "#wins"],
    engagement: "High",
    color: "bg-purple-500"
  },
  {
    type: "Tips",
    title: "5 tools that changed my game",
    hashtags: ["#tools", "#tips", "#productivity", "#recommendations"],
    engagement: "Very High",
    color: "bg-orange-500"
  }
];

const trendingHashtags = [
  { tag: "#productivity", reach: "2.1M", trend: "up" },
  { tag: "#entrepreneur", reach: "1.8M", trend: "up" },
  { tag: "#tech", reach: "3.2M", trend: "stable" },
  { tag: "#ai", reach: "987K", trend: "up" },
  { tag: "#startup", reach: "1.5M", trend: "down" },
];

export const ContentStrategy = () => {
  const [topic, setTopic] = useState("");
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCaption = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first");
      return;
    }

    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const captions = [
        `🚀 Diving deep into ${topic} today!\n\nHere's what I've learned that could change your perspective:\n\n1. The power of consistent small actions\n2. Why timing matters more than perfection\n3. How to turn setbacks into comebacks\n\nWhat's your experience with ${topic}? Drop your thoughts below! 👇\n\n#growth #mindset #${topic.toLowerCase().replace(/\s+/g, '')}`,
        `💡 ${topic} isn't just a skill—it's a superpower.\n\nAfter months of testing and optimizing, here are the 3 game-changers:\n\n✨ Focus on systems, not goals\n✨ Embrace the messy middle\n✨ Celebrate micro-wins daily\n\nWhich one resonates with you most?\n\n#productivity #${topic.toLowerCase().replace(/\s+/g, '')} #success`,
      ];
      setGeneratedCaption(captions[Math.floor(Math.random() * captions.length)]);
      setIsGenerating(false);
      toast.success("Caption generated successfully!");
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="grid gap-6">
      {/* AI Caption Generator */}
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Caption Generator
          </CardTitle>
          <CardDescription>Generate engaging captions tailored to your audience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your topic or theme..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-slate-700 border-slate-600"
            />
            <Button onClick={generateCaption} disabled={isGenerating} className="bg-purple-600 hover:bg-purple-700">
              {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Generate"}
            </Button>
          </div>
          
          {generatedCaption && (
            <div className="relative">
              <Textarea
                value={generatedCaption}
                onChange={(e) => setGeneratedCaption(e.target.value)}
                className="bg-slate-700 border-slate-600 min-h-[150px]"
                placeholder="Your generated caption will appear here..."
              />
              <Button
                onClick={() => copyToClipboard(generatedCaption)}
                size="sm"
                className="absolute top-2 right-2 bg-slate-600 hover:bg-slate-500"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Ideas */}
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              AI Content Ideas
            </CardTitle>
            <CardDescription>Personalized content suggestions based on your niche</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentIdeas.map((idea, index) => (
                <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${idea.color} text-white`}>{idea.type}</Badge>
                    <Badge variant="outline" className={
                      idea.engagement === "Very High" ? "border-green-500 text-green-400" :
                      idea.engagement === "High" ? "border-yellow-500 text-yellow-400" :
                      "border-blue-500 text-blue-400"
                    }>
                      {idea.engagement}
                    </Badge>
                  </div>
                  <h4 className="font-medium mb-2">{idea.title}</h4>
                  <div className="flex flex-wrap gap-1">
                    {idea.hashtags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs text-purple-400 cursor-pointer hover:text-purple-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hashtag Research */}
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Trending Hashtags
            </CardTitle>
            <CardDescription>Real-time hashtag performance in your niche</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingHashtags.map((hashtag, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="font-medium text-purple-400">{hashtag.tag}</div>
                    <div className="text-sm text-muted-foreground">{hashtag.reach} posts</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      hashtag.trend === "up" ? "bg-green-500" :
                      hashtag.trend === "down" ? "bg-red-500" :
                      "bg-yellow-500"
                    }`}></div>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(hashtag.tag)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posting Calendar */}
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Optimal Posting Schedule
          </CardTitle>
          <CardDescription>AI-recommended posting times based on your audience analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="p-3 bg-slate-700/50 rounded-lg">
                <div className="font-medium text-sm mb-2">{day}</div>
                <div className="text-xs text-green-400">9:00 AM</div>
                <div className="text-xs text-purple-400">6:30 PM</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
