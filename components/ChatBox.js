function ChatBox({ messages, onNewMessage, userRole }) {
  try {
    const [newMessage, setNewMessage] = React.useState('');
    const [currentUser] = React.useState({
      name: userRole === 'streamer' ? '主播' : '观众' + Math.floor(Math.random() * 1000),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    });

    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
      e.preventDefault();
      if (newMessage.trim()) {
        const message = {
          id: Date.now(),
          user: currentUser,
          content: newMessage,
          timestamp: new Date().toLocaleTimeString(),
          isStreamer: userRole === 'streamer'
        };
        onNewMessage(message);
        setNewMessage('');
      }
    };

    return (
      <div className="card h-[600px] flex flex-col" data-name="chat-box" data-file="components/ChatBox.js">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border-color)]">
          <h3 className="font-semibold text-lg">聊天室</h3>
          <div className="flex items-center text-sm text-[var(--text-secondary)]">
            <div className="icon-message-circle text-lg mr-1"></div>
            {messages.length} 条消息
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.map(message => (
            <div key={message.id} className="flex items-start gap-2">
              <img 
                src={message.user.avatar}
                alt={message.user.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${message.isStreamer ? 'text-[var(--primary-color)]' : 'text-[var(--text-primary)]'}`}>
                    {message.user.name}
                    {message.isStreamer && (
                      <span className="ml-1 px-1 py-0.5 bg-[var(--primary-color)] text-white text-xs rounded">主播</span>
                    )}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">{message.timestamp}</span>
                </div>
                <p className="text-sm text-[var(--text-primary)] break-words">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="输入消息..."
            className="input-field flex-1"
          />
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={!newMessage.trim()}
          >
            <div className="icon-send text-lg"></div>
          </button>
        </form>
      </div>
    );
  } catch (error) {
    console.error('ChatBox component error:', error);
    return null;
  }
}