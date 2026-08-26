import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Calendar, Send, CheckCircle2 } from 'lucide-react';

const Messages = () => {
  const { api, user } = useContext(AuthContext);
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [activeThread, setActiveThread] = useState(null);
  const [newChatUser, setNewChatUser] = useState(location.state?.newChatUser || null);

  useEffect(() => {
    if (newChatUser && !activeThread) {
      setActiveThread(newChatUser._id);
    }
  }, [newChatUser, activeThread]);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching messages', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [api]);

  // Filter out corrupted messages where users were deleted
  const validMessages = messages.filter(msg => msg.senderId && msg.receiverId);

  // Group messages by conversation partner
  const conversations = validMessages.reduce((acc, msg) => {
    const partnerId = msg.senderId._id === user._id ? msg.receiverId._id : msg.senderId._id;
    const partner = msg.senderId._id === user._id ? msg.receiverId : msg.senderId;
    
    if (!acc[partnerId]) {
      acc[partnerId] = {
        partner,
        messages: []
      };
    }
    acc[partnerId].messages.push(msg);
    return acc;
  }, {});

  // Inject the new user if they have no messages yet
  if (newChatUser && !conversations[newChatUser._id]) {
    conversations[newChatUser._id] = {
      partner: newChatUser,
      messages: []
    };
  }

  const handleSendReply = async (receiverId) => {
    if (!replyContent.trim()) return;
    try {
      await api.post('/messages', {
        receiverId,
        content: replyContent,
        type: 'chat'
      });
      setReplyContent('');
      fetchMessages();
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const markAsRead = async (msgId) => {
    try {
      await api.put(`/messages/${msgId}/read`);
      fetchMessages();
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  if (loading) return <div className="container" style={{paddingTop: '5rem'}}>Loading Messages...</div>;

  const activeConversation = activeThread ? conversations[activeThread] : null;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MessageSquare /> Inbox
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        
        {/* Sidebar - Conversation List */}
        <div className="glass-panel" style={{ overflowY: 'auto', padding: '1rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Conversations</h3>
          
          {Object.keys(conversations).length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>No messages yet.</p>
          ) : (
            Object.values(conversations).map((conv) => {
              const latestMsg = conv.messages[0];
              const isUnread = latestMsg && !latestMsg.read && latestMsg.receiverId._id === user._id;
              
              return (
                <div 
                  key={conv.partner._id}
                  onClick={() => setActiveThread(conv.partner._id)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: activeThread === conv.partner._id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    border: '1px solid',
                    borderColor: activeThread === conv.partner._id ? 'var(--accent-primary)' : 'transparent',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <img src={conv.partner?.avatar || 'https://via.placeholder.com/32'} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <div style={{ fontWeight: isUnread ? 'bold' : 'normal' }}>{conv.partner?.name || 'Unknown User'}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: isUnread ? 'white' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {latestMsg ? (
                      (latestMsg.senderId._id === user._id ? 'You: ' : '') + latestMsg.content
                    ) : (
                      'Start a new conversation...'
                    )}
                  </div>
                  {isUnread && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '10px', height: '10px', backgroundColor: 'var(--accent-primary)', borderRadius: '50%' }}></div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Chat Area */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <img src={activeConversation.partner?.avatar || 'https://via.placeholder.com/40'} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div>
                  <h3 style={{ margin: 0 }}>{activeConversation.partner?.name || 'Unknown User'}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {activeConversation.partner?.role 
                      ? (['user', 'candidate'].includes(activeConversation.partner.role.toLowerCase()) 
                          ? 'Applicant' 
                          : activeConversation.partner.role.charAt(0).toUpperCase() + activeConversation.partner.role.slice(1)) 
                      : ''}
                  </span>
                </div>
              </div>

              {/* Chat History */}
              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', gap: '1rem' }}>
                {activeConversation.messages.map((msg) => {
                  const isMe = msg.senderId._id === user._id;
                  
                  // Mark as read if not read and not me
                  if (!isMe && !msg.read) {
                    markAsRead(msg._id);
                  }

                  return (
                    <div key={msg._id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      {msg.type === 'interview' && (
                        <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#d8b4fe', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.8rem', marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={14} /> Interview Request
                        </div>
                      )}
                      <div style={{ 
                        backgroundColor: isMe ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', 
                        padding: '1rem 1.25rem', 
                        borderRadius: '1.25rem',
                        borderBottomRightRadius: isMe ? '0.25rem' : '1.25rem',
                        borderBottomLeftRadius: !isMe ? '0.25rem' : '1.25rem',
                        maxWidth: '80%',
                        color: 'white'
                      }}>
                        {msg.content}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMe && msg.read && <CheckCircle2 size={12} style={{ color: 'var(--accent-success)' }} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    style={{ marginBottom: 0, flex: 1 }} 
                    placeholder="Type a message..." 
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendReply(activeThread)}
                  />
                  <button className="btn btn-primary" onClick={() => handleSendReply(activeThread)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Send <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', flexDirection: 'column', gap: '1rem' }}>
              <MessageSquare size={48} opacity={0.2} />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
