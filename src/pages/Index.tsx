
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, Target, Eye, TrendingUp, ArrowRight, Command, Shield, Cpu } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Deep learning algorithms analyze your audience behavior and engagement patterns in real-time."
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description: "Identify and engage with your ideal audience using advanced demographic and psychographic analysis."
    },
    {
      icon: TrendingUp,
      title: "Growth Intelligence",
      description: "Strategic insights and automated recommendations to accelerate your Instagram growth."
    },
    {
      icon: Eye,
      title: "Competitor Intel",
      description: "Monitor competitor strategies and discover opportunities in your niche with stealth precision."
    },
    {
      icon: Zap,
      title: "Content Optimization",
      description: "AI-generated captions, hashtag research, and optimal posting schedules for maximum impact."
    },
    {
      icon: Shield,
      title: "Mission Control",
      description: "Full command center with real-time monitoring, automated missions, and strategic oversight."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-500">
            <Command className="h-3 w-3 mr-1" />
            AI-Powered Instagram Intelligence
          </Badge>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent leading-tight">
            Instagram Command Center
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            A sophisticated AI-powered dashboard that transforms your Instagram strategy with precision analytics, 
            competitive intelligence, and automated growth optimization. Your digital war machine for social media dominance.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/dashboard')} 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
            >
              Launch Command Center
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-500 text-purple-300 hover:bg-purple-600/10 px-8 py-4 text-lg"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800/70 transition-all duration-300 group">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-purple-400 mb-2 group-hover:text-purple-300 transition-colors" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-green-400 mb-2">99.2%</div>
            <div className="text-slate-300">System Uptime</div>
          </div>
          <div className="text-center p-6 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-purple-400 mb-2">127+</div>
            <div className="text-slate-300">Daily Followers</div>
          </div>
          <div className="text-center p-6 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-blue-400 mb-2">5.2%</div>
            <div className="text-slate-300">Avg Engagement</div>
          </div>
          <div className="text-center p-6 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
            <div className="text-slate-300">AI Monitoring</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-500/20">
          <Cpu className="h-16 w-16 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Instagram Empire?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join the ranks of strategic Instagram commanders who leverage AI intelligence 
            to build influential, engaged communities and drive real business results.
          </p>
          <Button 
            onClick={() => navigate('/dashboard')} 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg"
          >
            Initialize Command Center
            <Command className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
