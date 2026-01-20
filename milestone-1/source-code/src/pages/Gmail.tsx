import { Layout } from '@/components/layout/Layout';
import { useGovind } from '@/contexts/GovindContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Star, 
  Trash2, 
  Archive, 
  MoreVertical, 
  Mic,
  RefreshCcw,
  Inbox,
  Send,
  File,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
  starred: boolean;
  labels: string[];
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'John Smith',
    subject: 'Project Update - Q4 Goals',
    preview: 'Hi team, I wanted to share the latest progress on our Q4 objectives...',
    time: '10:30 AM',
    read: false,
    starred: true,
    labels: ['Work'],
  },
  {
    id: '2',
    from: 'Sarah Johnson',
    subject: 'Meeting Tomorrow at 2 PM',
    preview: 'Hi, just a reminder about our scheduled meeting tomorrow...',
    time: '9:15 AM',
    read: false,
    starred: false,
    labels: ['Meetings'],
  },
  {
    id: '3',
    from: 'GitHub',
    subject: '[repo] New pull request submitted',
    preview: 'A new pull request has been opened on your repository...',
    time: 'Yesterday',
    read: true,
    starred: false,
    labels: ['GitHub'],
  },
  {
    id: '4',
    from: 'Newsletter',
    subject: 'Your Weekly Tech Digest',
    preview: 'This week in tech: AI breakthroughs, new frameworks...',
    time: 'Yesterday',
    read: true,
    starred: false,
    labels: [],
  },
  {
    id: '5',
    from: 'Team Lead',
    subject: 'Urgent: Client Feedback Required',
    preview: 'We need your input on the client presentation by EOD...',
    time: '2 days ago',
    read: false,
    starred: true,
    labels: ['Urgent', 'Work'],
  },
];

const Gmail = () => {
  const { speak, addMessage } = useGovind();
  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const unreadCount = emails.filter(e => !e.read).length;

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setEmails(prev => prev.map(e => 
      e.id === email.id ? { ...e, read: true } : e
    ));
    addMessage('user', `Read email from ${email.from}`);
    speak(`Email from ${email.from}. Subject: ${email.subject}. ${email.preview}`);
  };

  const handleReadUnread = () => {
    addMessage('user', 'Read my unread emails');
    const unread = emails.filter(e => !e.read);
    if (unread.length === 0) {
      speak("You have no unread emails.");
    } else {
      speak(`You have ${unread.length} unread emails. The most recent is from ${unread[0].from} about ${unread[0].subject}.`);
    }
  };

  const folders = [
    { icon: Inbox, label: 'Inbox', count: unreadCount },
    { icon: Star, label: 'Starred', count: emails.filter(e => e.starred).length },
    { icon: Send, label: 'Sent', count: 0 },
    { icon: File, label: 'Drafts', count: 2 },
    { icon: Trash2, label: 'Trash', count: 0 },
  ];

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Sidebar */}
        <div className="w-56 border-r border-border/50 p-4 hidden lg:block">
          <Button className="w-full mb-4" onClick={() => {
            addMessage('user', 'Compose new email');
            speak("Who would you like to send an email to?");
          }}>
            <Mail className="w-4 h-4 mr-2" />
            Compose
          </Button>

          <nav className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder.label}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <folder.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{folder.label}</span>
                </div>
                {folder.count > 0 && (
                  <span className="text-xs text-muted-foreground">{folder.count}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">Inbox</h1>
              <Badge variant="secondary">{unreadCount} unread</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleReadUnread}>
                <Mic className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Email List */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border/50">
              {emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className={cn(
                    "flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-secondary/50",
                    !email.read && "bg-secondary/30",
                    selectedEmail?.id === email.id && "bg-primary/10"
                  )}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEmails(prev => prev.map(e => 
                        e.id === email.id ? { ...e, starred: !e.starred } : e
                      ));
                    }}
                    className="mt-1"
                  >
                    <Star className={cn(
                      "w-4 h-4",
                      email.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    )} />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "text-sm truncate",
                        !email.read && "font-semibold"
                      )}>
                        {email.from}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {email.time}
                      </span>
                    </div>
                    <p className={cn(
                      "text-sm truncate",
                      !email.read ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {email.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {email.preview}
                    </p>
                    {email.labels.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {email.labels.map((label) => (
                          <Badge key={label} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Email Preview */}
        {selectedEmail && (
          <div className="w-96 border-l border-border/50 p-6 hidden xl:block">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{selectedEmail.from}</span>
                <span>•</span>
                <span>{selectedEmail.time}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedEmail.preview}
              <br /><br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <div className="flex gap-2 mt-6">
              <Button variant="secondary" onClick={() => {
                addMessage('user', 'Reply to this email');
                speak("What would you like to say in your reply?");
              }}>
                Reply
              </Button>
              <Button variant="ghost">Forward</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Gmail;
