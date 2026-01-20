import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mic, 
  Mail, 
  MessageSquare, 
  Settings, 
  User,
  Navigation,
  HelpCircle,
  Volume2
} from 'lucide-react';

const Docs = () => {
  const commands = [
    {
      category: 'General',
      icon: Mic,
      items: [
        { command: '"Hey Govind"', description: 'Wake up the assistant' },
        { command: '"Stop listening"', description: 'Deactivate voice recognition' },
        { command: '"Repeat that"', description: 'Repeat the last response' },
        { command: '"Cancel"', description: 'Cancel current action' },
      ],
    },
    {
      category: 'Email',
      icon: Mail,
      items: [
        { command: '"Check my emails"', description: 'Read unread email summary' },
        { command: '"Read my inbox"', description: 'List recent emails' },
        { command: '"Send email to [name]"', description: 'Compose new email' },
        { command: '"Reply to this"', description: 'Reply to current email' },
      ],
    },
    {
      category: 'Messaging',
      icon: MessageSquare,
      items: [
        { command: '"Check messages"', description: 'Read new messages' },
        { command: '"Send message to [name]"', description: 'Compose message' },
        { command: '"Read last message"', description: 'Read most recent message' },
      ],
    },
    {
      category: 'Navigation',
      icon: Navigation,
      items: [
        { command: '"Go to dashboard"', description: 'Navigate to dashboard' },
        { command: '"Open Gmail"', description: 'Open Gmail page' },
        { command: '"Go to settings"', description: 'Open settings' },
        { command: '"Go back"', description: 'Return to previous page' },
      ],
    },
    {
      category: 'Authentication',
      icon: User,
      items: [
        { command: '"Log me in"', description: 'Start login flow' },
        { command: '"Log out"', description: 'Sign out (requires confirmation)' },
        { command: '"Change my PIN"', description: 'Update voice PIN' },
      ],
    },
    {
      category: 'Help',
      icon: HelpCircle,
      items: [
        { command: '"Help"', description: 'Get assistance' },
        { command: '"What can you do?"', description: 'List capabilities' },
        { command: '"How do I..."', description: 'Get specific guidance' },
      ],
    },
  ];

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Documentation</h1>
          <p className="text-muted-foreground">Learn how to use Govind voice commands</p>
        </div>

        {/* Quick Start */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Quick Start
            </h2>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-medium">1</span>
                <span>Say <strong>"Hey Govind"</strong> to wake up the assistant</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-medium">2</span>
                <span>Wait for the acknowledgment sound or "Yes, I'm listening"</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-medium">3</span>
                <span>Speak naturally - Govind understands conversational language</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-medium">4</span>
                <span>Wait for confirmation before speaking again</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Voice Commands */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Voice Commands</h2>
          
          <div className="grid gap-6">
            {commands.map((section) => (
              <Card key={section.category} className="bg-card/50 border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <section.icon className="w-5 h-5 text-primary" />
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.items.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-4 py-2 border-b border-border/30 last:border-0"
                      >
                        <code className="text-sm text-primary bg-primary/10 px-2 py-1 rounded flex-shrink-0">
                          {item.command}
                        </code>
                        <span className="text-sm text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Speak clearly and at a natural pace
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Minimize background noise when possible
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Wait for Govind to finish speaking before giving new commands
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Use "cancel" to abort any action in progress
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Say "repeat" if you didn't catch the response
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Docs;
