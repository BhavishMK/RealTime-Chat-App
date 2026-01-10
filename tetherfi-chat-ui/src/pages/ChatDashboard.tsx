import { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { Send, Reply, User as UserIcon, LogOut, MessageSquare, ChevronDown, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { chatApi, identityApi } from '../services/api';

export default function ChatDashboard() {
    const { messages, onlineUsers, setOnlineUsers, connection, setMessages } = useChat();
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // State
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [inputText, setInputText] = useState("");
    const [replyingTo, setReplyingTo] = useState<any>(null);
    const [currentStatus, setCurrentStatus] = useState('Available');

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    useEffect(() => {
        // Fetch users from the Identity Service
        const fetchColleagues = async () => {
            try {
                // Use the identityApi instance we created earlier
                const response = await identityApi.get('/users'); 
                setOnlineUsers(response.data);
            } catch (err) {
                console.error("Failed to load colleagues", err);
            }
        };

        fetchColleagues();
    }, []);

    // Requirement: Fetch history when selecting a user
   useEffect(() => {
    const fetchHistory = async () => {
        if (selectedUser) {
            try {
                // This calls https://localhost:7002/api/messages/history/8
                const response = await chatApi.get(`/messages/history/${selectedUser.id}`);
                setMessages(response.data);
            } catch (err) {
                console.error("Could not load history", err);
            }
        }
    };
    fetchHistory();
}, [selectedUser]); // Triggers every time you click a different colleague
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    

    // Requirement: One-to-one text messaging & Reply
 const handleSendMessage = async () => {
    // 1. Ensure connection is 'Connected', not just 'Existing'
    if (!inputText.trim() || !selectedUser || connection?.state !== "Connected") {
        console.error("SignalR is not in Connected state. Current state:", connection?.state);
        return;
    }

    try {
        // Your Hub: SendPrivateMessage(int receiverId, string content, int? replyToId)
        // Ensure receiverId is a NUMBER
        const receiverId = parseInt(selectedUser.id);
        const content = inputText;
        const replyToId = replyingTo?.id ? parseInt(replyingTo.id) : null;

        await connection.invoke("SendPrivateMessage", receiverId, content, replyToId);

        // Clear UI
        setInputText("");
        setReplyingTo(null);
    } catch (err) {
        console.error("SignalR Send Error:", err);
    }
};

    // Requirement: User Status Implementation
   const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    
    // Update Database via REST
    await identityApi.patch('/users/status', { status: newStatus }); // <--- Changed to identityApi
    
    // Notify others via SignalR
    if (connection) {
        await connection.invoke("UpdateStatus", newStatus);
    }
};
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const conversationMessages = messages.filter(m => 
        (m.senderId === currentUser.id && m.receiverId === selectedUser?.id) || 
        (m.senderId === selectedUser?.id && m.receiverId === currentUser.id)
    );

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r flex flex-col shadow-lg z-10">
                <div className="p-4 bg-indigo-700 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-indigo-300">
                                <UserIcon size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">{currentUser.username}</p>
                                <p className="text-[10px] text-indigo-200">Online</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="p-2 hover:bg-indigo-600 rounded-lg transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>

                    <div className="relative">
                        <select 
                            value={currentStatus}
                            onChange={handleStatusChange}
                            className="w-full bg-indigo-800 text-xs border border-indigo-500 rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer"
                        >
                            <option value="Available">🟢 Available</option>
                            <option value="Busy">🔴 Busy</option>
                            <option value="Away">🟡 Away</option>
                            <option value="Offline">⚪ Offline</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-2.5 pointer-events-none opacity-60" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 text-xs font-bold text-gray-400 uppercase">Colleagues</div>
                    {onlineUsers.filter(u => u.id !== currentUser.id).map(user => (
                        <div 
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`px-4 py-3 flex items-center cursor-pointer border-b transition-all ${
                                selectedUser?.id === user.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <UserIcon className="text-gray-400" />
                                </div>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                            </div>
                            <div className="ml-3 flex-1 overflow-hidden">
                                <p className="font-semibold text-gray-800 truncate">{user.username}</p>
                                <p className="text-xs text-gray-500">{user.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-[#f8fafc]">
                {selectedUser ? (
                    <>
                        <div className="p-4 bg-white border-b flex items-center shadow-sm">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                <UserIcon size={20} />
                            </div>
                            <div className="ml-3">
                                <h3 className="font-bold text-gray-800">{selectedUser.username}</h3>
                                <p className="text-xs text-green-500 font-medium">{selectedUser.status}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {conversationMessages.map((msg: any) => (
                                <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] group relative rounded-2xl p-3 shadow-sm ${
                                        msg.senderId === currentUser.id 
                                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 rounded-tl-none border'
                                    }`}>
                                        {msg.replyToId && (
                                            <div className={`text-[11px] mb-2 p-2 rounded border-l-4 ${
                                                msg.senderId === currentUser.id ? 'bg-indigo-700/50 border-indigo-300' : 'bg-gray-100 border-indigo-500'
                                            }`}>
                                                <p className="italic opacity-80">Replying to a previous message</p>
                                            </div>
                                        )}
                                        <p className="text-sm">{msg.content}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                                            <Clock size={10} />
                                            <span className="text-[9px]">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <button 
                                            onClick={() => setReplyingTo(msg)}
                                            className={`absolute top-1/2 -translate-y-1/2 ${msg.senderId === currentUser.id ? '-left-10' : '-right-10'} opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-indigo-600`}
                                        >
                                            <Reply size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t">
                            {replyingTo && (
                                <div className="flex justify-between items-center bg-indigo-50 p-2 px-4 text-xs rounded-t-xl border-l-4 border-indigo-600 mb-0">
                                    <span className="truncate">Replying to: <b>{replyingTo.content}</b></span>
                                    <button onClick={() => setReplyingTo(null)} className="text-indigo-800 ml-2">✕</button>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <input 
                                    className={`flex-1 border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 ${replyingTo ? 'rounded-b-xl' : 'rounded-xl'}`}
                                    placeholder="Type your message..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    className="bg-indigo-600 text-white p-3.5 rounded-xl hover:bg-indigo-700 shadow-lg active:scale-95 transition-all"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare size={64} className="mb-4 opacity-20" />
                        <h2 className="text-xl font-semibold text-gray-600">Tetherfi Real-Time Chat</h2>
                        <p>Select a colleague to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'available': return 'bg-green-500';
        case 'busy': return 'bg-red-500';
        case 'away': return 'bg-yellow-500';
        default: return 'bg-gray-400';
    }
};