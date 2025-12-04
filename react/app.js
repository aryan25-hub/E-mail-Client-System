import React, { useState } from 'react';
import { Mail, Send, Inbox, Star, Trash2, Archive, Clock, Search, Plus, Paperclip, Menu, X } from 'lucide-react';

export default function EmailClientSystem() {
  const [emails, setEmails] = useState([
    {
      id: 1,
      from: 'john.doe@example.com',
      subject: 'Project Update - Q4 2024',
      preview: 'Hi team, I wanted to share the latest updates on our Q4 projects...',
      body: 'Hi team, I wanted to share the latest updates on our Q4 projects. We have made significant progress and are on track to meet our deliverables.',
      timestamp: '10:30 AM',
      read: false,
      starred: false,
      folder: 'inbox'
    },
    {
      id: 2,
      from: 'sarah.smith@company.com',
      subject: 'Meeting Reminder: Design Review',
      preview: 'This is a reminder about tomorrow\'s design review meeting...',
      body: 'This is a reminder about tomorrow\'s design review meeting at 2 PM. Please prepare your presentations and bring any relevant materials.',
      timestamp: '9:15 AM',
      read: true,
      starred: true,
      folder: 'inbox'
    },
    {
      id: 3,
      from: 'notifications@github.com',
      subject: 'Pull Request Merged',
      preview: 'Your pull request #234 has been successfully merged...',
      body: 'Your pull request #234 has been successfully merged into the main branch. Great work on the new feature implementation!',
      timestamp: 'Yesterday',
      read: true,
      starred: false,
      folder: 'inbox'
    }
  ]);

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  const folders = [
    { name: 'inbox', icon: Inbox, label: 'Inbox', count: emails.filter(e => e.folder === 'inbox' && !e.read).length },
    { name: 'starred', icon: Star, label: 'Starred', count: emails.filter(e => e.starred).length },
    { name: 'sent', icon: Send, label: 'Sent', count: 0 },
    { name: 'drafts', icon: Clock, label: 'Drafts', count: 0 },
    { name: 'archive', icon: Archive, label: 'Archive', count: emails.filter(e => e.folder === 'archive').length },
    { name: 'trash', icon: Trash2, label: 'Trash', count: emails.filter(e => e.folder === 'trash').length }
  ];

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setEmails(emails.map(e => 
      e.id === email.id ? { ...e, read: true } : e
    ));
  };

  const toggleStar = (emailId, e) => {
    e.stopPropagation();
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  const moveToFolder = (emailId, folder) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, folder } : email
    ));
    setSelectedEmail(null);
  };

  const handleSendEmail = () => {
    if (composeData.to && composeData.subject) {
      const newEmail = {
        id: emails.length + 1,
        from: 'me@example.com',
        subject: composeData.subject,
        preview: composeData.body.substring(0, 50) + '...',
        body: composeData.body,
        timestamp: 'Just now',
        read: true,
        starred: false,
        folder: 'sent'
      };
      setEmails([newEmail, ...emails]);
      setComposeData({ to: '', subject: '', body: '' });
      setShowCompose(false);
    }
  };

  const filteredEmails = emails.filter(email => {
    const matchesFolder = currentFolder === 'starred' 
      ? email.starred 
      : email.folder === currentFolder;
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r transition-all duration-300 overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Mail size={28} />
              MailBox
            </h1>
          </div>
          
          <button
            onClick={() => setShowCompose(true)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition mb-6"
          >
            <Plus size={20} />
            Compose
          </button>

          <nav className="space-y-1">
            {folders.map(folder => (
              <button
                key={folder.name}
                onClick={() => setCurrentFolder(folder.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                  currentFolder === folder.name
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <folder.icon size={20} />
                  <span className="font-medium">{folder.label}</span>
                </div>
                {folder.count > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {folder.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Email List */}
          <div className="w-96 bg-white border-r overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold capitalize">{currentFolder}</h2>
              <p className="text-sm text-gray-500">{filteredEmails.length} emails</p>
            </div>
            
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Mail size={48} className="mx-auto mb-4 opacity-50" />
                <p>No emails found</p>
              </div>
            ) : (
              <div>
                {filteredEmails.map(email => (
                  <div
                    key={email.id}
                    onClick={() => handleEmailClick(email)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                      !email.read ? 'bg-blue-50' : ''
                    } ${selectedEmail?.id === email.id ? 'bg-blue-100' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${!email.read ? 'font-bold' : 'font-medium'}`}>
                          {email.from}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={(e) => toggleStar(email.id, e)}
                          className="text-gray-400 hover:text-yellow-500 transition"
                        >
                          <Star size={16} fill={email.starred ? 'currentColor' : 'none'} />
                        </button>
                        <span className="text-xs text-gray-500">{email.timestamp}</span>
                      </div>
                    </div>
                    <p className={`text-sm mb-1 ${!email.read ? 'font-semibold' : ''}`}>
                      {email.subject}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{email.preview}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email Detail */}
          <div className="flex-1 bg-white overflow-y-auto">
            {selectedEmail ? (
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2>
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">{selectedEmail.from}</p>
                      <p className="text-sm text-gray-500">{selectedEmail.timestamp}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStar(selectedEmail.id, { stopPropagation: () => {} })}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Star size={20} fill={selectedEmail.starred ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => moveToFolder(selectedEmail.id, 'archive')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Archive size={20} />
                      </button>
                      <button
                        onClick={() => moveToFolder(selectedEmail.id, 'trash')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedEmail.body}</p>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Send size={18} />
                    Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Mail size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Select an email to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">New Message</h3>
              <button
                onClick={() => setShowCompose(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <input
                  type="email"
                  value={composeData.to}
                  onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="recipient@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={composeData.body}
                  onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-48 resize-none"
                  placeholder="Write your message..."
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border-t">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Paperclip size={18} />
                Attach
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Send size={18} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}