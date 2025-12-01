"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Palette, Zap, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      <header className="flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shrink-0 z-10">
        <SidebarTrigger />
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-lg tracking-tight">Settings</span>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="container max-w-5xl mx-auto p-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="general">
                <Settings className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="h-4 w-4 mr-2" />
                UI
              </TabsTrigger>
              <TabsTrigger value="simulation">
                <Zap className="h-4 w-4 mr-2" />
                Sim
              </TabsTrigger>
              <TabsTrigger value="data">
                <Database className="h-4 w-4 mr-2" />
                Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure basic application preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for important events
                      </p>
                    </div>
                    <Switch id="notifications" />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sound">Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for agent interactions
                      </p>
                    </div>
                    <Switch id="sound" />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue="dark">
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="animations">Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable smooth transitions and effects
                      </p>
                    </div>
                    <Switch id="animations" defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="zoom">Map Zoom Level</Label>
                      <span className="text-sm text-muted-foreground">100%</span>
                    </div>
                    <Slider id="zoom" defaultValue={[100]} max={200} min={50} step={10} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="simulation" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Simulation Settings</CardTitle>
                  <CardDescription>Control simulation behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="speed">Simulation Speed</Label>
                      <span className="text-sm text-muted-foreground">1x</span>
                    </div>
                    <Slider id="speed" defaultValue={[1]} max={5} min={0.5} step={0.5} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Auto Save</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save simulation state
                      </p>
                    </div>
                    <Switch id="auto-save" defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="tick-rate">Update Frequency</Label>
                    <Select defaultValue="1000">
                      <SelectTrigger id="tick-rate">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500">500ms (Fast)</SelectItem>
                        <SelectItem value="1000">1s (Normal)</SelectItem>
                        <SelectItem value="2000">2s (Slow)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Manage your simulation data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Export Data</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Download your simulation data as JSON
                    </p>
                    <Button variant="outline" className="w-full">
                      Export Simulation Data
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Import Data</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Load a previously exported simulation
                    </p>
                    <Button variant="outline" className="w-full">
                      Import Simulation Data
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-destructive">Reset Simulation</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      This will delete all current data and start fresh
                    </p>
                    <Button variant="destructive" className="w-full">
                      Reset All Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
