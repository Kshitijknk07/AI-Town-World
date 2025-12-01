"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUIStore } from "@/components/store/ui-store";
import { cn } from "@/lib/utils";
import { Activity, MapPin, Zap } from "lucide-react";

export default function AgentsPage() {
  const { agents } = useUIStore();

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      <header className="flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shrink-0 z-10">
        <SidebarTrigger />
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-lg tracking-tight">Agents</span>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="container max-w-7xl mx-auto p-6">
          <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{agents.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active in simulation</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Energy</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all agents</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground mt-1">Buildings occupied</p>
                </CardContent>
              </Card>
            </div>

            {/* Agents Grid */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Agents</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="idle">Idle</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {agents.map((agent) => (
                    <Card
                      key={agent.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-4 bg-gradient-to-b from-muted/30 to-transparent">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar
                              className={cn(
                                "h-12 w-12 border-2 border-background shadow-sm",
                                agent.color
                              )}
                            >
                              <AvatarFallback className="text-white text-xl">
                                {agent.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{agent.name}</CardTitle>
                              <Badge variant="secondary" className="mt-1 text-xs capitalize">
                                {agent.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {agent.position.x}, {agent.position.y}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Activity Level</span>
                            <span className="font-medium">High</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[85%]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-6">
                <div className="text-center py-12 text-muted-foreground">
                  Active agents view coming soon
                </div>
              </TabsContent>

              <TabsContent value="idle" className="mt-6">
                <div className="text-center py-12 text-muted-foreground">
                  Idle agents view coming soon
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
