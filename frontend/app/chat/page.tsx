"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Activity, AlertCircle, CheckCircle } from "lucide-react";

interface Event {
  id: string;
  type: string;
  agent: string;
  message: string;
  timestamp: Date;
  icon: string;
}

interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

export default function ChatPage() {
  const [events] = useState<Event[]>(() => [
    {
      id: "1",
      type: "social",
      agent: "Alex",
      message: "Started a conversation with Sam at the Cafe",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      icon: "💬",
    },
    {
      id: "2",
      type: "movement",
      agent: "Taylor",
      message: "Moved to Central Park",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      icon: "🚶",
    },
    {
      id: "3",
      type: "activity",
      agent: "Sam",
      message: "Started working at the Library",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: "💻",
    },
    {
      id: "4",
      type: "social",
      agent: "Alex",
      message: "Waved to Taylor in the park",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      icon: "👋",
    },
  ]);

  const [chats] = useState<Chat[]>(() => [
    {
      id: "1",
      participants: ["Alex", "Sam"],
      lastMessage: "That sounds great! Let's meet at the cafe.",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      unread: 2,
    },
    {
      id: "2",
      participants: ["Taylor"],
      lastMessage: "Just finished my run in the park.",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      unread: 0,
    },
  ]);
  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      <header className="flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shrink-0 z-10">
        <SidebarTrigger />
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-lg tracking-tight">Chat & Logs</span>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="container max-w-7xl mx-auto p-6">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="events">Event Logs</TabsTrigger>
              <TabsTrigger value="chats">Conversations</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{events.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Social</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {events.filter((e: Event) => e.type === "social").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Movement</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {events.filter((e: Event) => e.type === "movement").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Activity</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {events.filter((e: Event) => e.type === "activity").length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {events.map((event: Event) => (
                        <div
                          key={event.id}
                          className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="text-3xl">{event.icon}</div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs capitalize">
                                {event.type}
                              </Badge>
                              <span className="font-semibold text-sm">{event.agent}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.message}</p>
                            <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                              {event.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chats" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {chats.map((chat: Chat) => (
                      <div
                        key={chat.id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{chat.participants.join(", ")}</h4>
                            {chat.unread > 0 && (
                              <Badge variant="default" className="text-xs">
                                {chat.unread} new
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                          <p
                            className="text-xs text-muted-foreground mt-1"
                            suppressHydrationWarning
                          >
                            {chat.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
