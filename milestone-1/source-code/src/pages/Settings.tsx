import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Volume2, 
  Mic, 
  Languages, 
  Moon, 
  Bell, 
  Keyboard,
  Zap,
  Accessibility
} from 'lucide-react';

const Settings = () => {
  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your Govind experience</p>
        </div>

        {/* Voice Settings */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary" />
              Voice Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Continuous Listening</p>
                  <p className="text-sm text-muted-foreground">Always listen for wake word</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Wake Word Sensitivity</p>
                  <span className="text-sm text-muted-foreground">Medium</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Voice Feedback</p>
                  <p className="text-sm text-muted-foreground">Govind speaks responses aloud</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Audio Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Speech Volume</p>
                <span className="text-sm text-muted-foreground">80%</span>
              </div>
              <Slider defaultValue={[80]} max={100} step={1} />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Speech Rate</p>
                <span className="text-sm text-muted-foreground">Normal</span>
              </div>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary" />
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted-foreground">Speech recognition and responses</p>
              </div>
              <Button variant="secondary">English (US)</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Announce new emails</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Message Alerts</p>
                <p className="text-sm text-muted-foreground">Announce new messages</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-primary" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">High Contrast Mode</p>
                <p className="text-sm text-muted-foreground">Increase visual contrast</p>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Screen Reader Support</p>
                <p className="text-sm text-muted-foreground">Enhanced screen reader compatibility</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-primary" />
              Keyboard Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Activate voice</span>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stop speaking</span>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs">Esc</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Open settings</span>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs">Ctrl + ,</kbd>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
