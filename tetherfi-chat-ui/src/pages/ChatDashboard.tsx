import { useState, useEffect, useRef, useMemo } from 'react'; // Added useMemo for performance
import { useChat } from '../context/ChatContext';
import { Send, Reply, User as UserIcon, LogOut, MessageSquare, ChevronDown, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { chatApi, identityApi } from '../services/api';
import * as signalR from "@microsoft/signalr";

export default function ChatDashboard() {
    const { messages, onlineUsers, setOnlineUsers, connection, setMessages, sendMessage } = useChat();
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [inputText, setInputText] = useState("");
    const [replyingTo, setReplyingTo] = useState<any>(null);
    const [currentStatus, setCurrentStatus] = useState('Available');

    const currentUser = useMemo(() => {
        const data = localStorage.getItem('user');
        if (!data || data === "undefined" || data === "null") return null;
        try { return JSON.parse(data); } catch { return null; }
    }, []);

    // --- SENIOR ARCHITECT FIX: HELPER TO GET RECENT MESSAGE ---
    const getLastMessage = (userId: number) => {
        const userMessages = messages.filter(m => 
            (Number(m.senderId) === userId && Number(m.receiverId) === Number(currentUser?.id)) ||
            (Number(m.senderId) === Number(currentUser?.id) && Number(m.receiverId) === userId)
        );
        if (userMessages.length === 0) return null;
        return userMessages[userMessages.length - 1]; // Return the latest one
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const fetchColleagues = async () => {
            try {
                const response = await identityApi.get('/users'); 
                setOnlineUsers(response.data);
            } catch (err) {
                console.error("Failed to load colleagues:", err);
            }
        };
        fetchColleagues();
    }, [setOnlineUsers]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (selectedUser && currentUser) {
                try {
                    const response = await chatApi.get(`/messages/history/${selectedUser.id}`);
                    setMessages(Array.isArray(response.data) ? response.data : []);
                } catch (err) {
                    console.error("History fetch error:", err);
                }
            }
        };
        fetchHistory();
    }, [selectedUser?.id]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || !selectedUser) return;
        await sendMessage(Number(selectedUser.id), inputText, replyingTo?.id ? Number(replyingTo.id) : null);
        setInputText("");
        setReplyingTo(null);
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setCurrentStatus(newStatus);
        await identityApi.patch('/users/status', { status: newStatus });
        if (connection?.state === signalR.HubConnectionState.Connected) {
            await connection.invoke("UpdateStatus", newStatus);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login'; 
    };

    if (!currentUser) return null;

    const conversationMessages = messages.filter(m => 
        (Number(m.senderId) === Number(currentUser.id) && Number(m.receiverId) === Number(selectedUser?.id)) || 
        (Number(m.senderId) === Number(selectedUser?.id) && Number(m.receiverId) === Number(currentUser.id))
    );

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r flex flex-col shadow-lg z-10">
                <div className="p-4 bg-indigo-700 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-indigo-300">
                                <UserIcon size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm truncate w-32">{currentUser.username}</p>
                                <p className="text-[10px] text-indigo-200 uppercase tracking-tighter">Online</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="p-2 hover:bg-indigo-600 rounded-lg transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                    <div className="relative">
                        <select value={currentStatus} onChange={handleStatusChange} className="w-full bg-indigo-800 text-xs border border-indigo-500 rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer">
                            <option value="Available">Available</option>
                            <option value="Busy">Busy</option>
                            <option value="Away">Away</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-2.5 pointer-events-none opacity-60" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b">Colleagues</div>
                    {onlineUsers.filter(u => Number(u.id) !== Number(currentUser.id)).map(user => {
                        const lastMsg = getLastMessage(Number(user.id)); // Get the latest msg
                        return (
                            <div 
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className={`px-4 py-3 flex items-center cursor-pointer border-b transition-all ${
                                    selectedUser?.id === user.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                                </div>
                                <div className="ml-3 flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-800 truncate text-sm">{user.username}</p>
                                        {lastMsg && (
                                            <span className="text-[9px] text-gray-400">
                                                {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    {/* --- THIS SHOWS THE RECENT MESSAGE --- */}
                                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                        {lastMsg ? (
                                            <span>{lastMsg.senderId === currentUser.id ? 'You: ' : ''}{lastMsg.content}</span>
                                        ) : (
                                            <span className="italic opacity-60">No messages yet</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedUser ? (
                    <>
                        <div className="p-4 bg-white border-b flex items-center shadow-sm">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                <UserIcon size={20} />
                            </div>
                            <div className="ml-3">
                                <h3 className="font-bold text-gray-800 text-sm">{selectedUser.username}</h3>
                                <p className={`text-[10px] font-bold uppercase ${selectedUser.status?.toLowerCase() === 'available' ? 'text-green-500' : 'text-gray-400'}`}>
                                    {selectedUser.status}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                            {conversationMessages.map((msg: any) => (
                                <div key={msg.id} className={`flex ${Number(msg.senderId) === Number(currentUser.id) ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] group relative rounded-2xl p-3 shadow-sm ${
                                        Number(msg.senderId) === Number(currentUser.id) 
                                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 rounded-tl-none border border-slate-200'
                                    }`}>
                                        <p className="text-sm">{msg.content}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1 opacity-50 text-[9px]">
                                            <Clock size={10} />
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t">
                            <div className="flex gap-3">
                                <input 
                                    className="flex-1 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                                    placeholder="Type your message..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button onClick={handleSendMessage} className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 shadow-md">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare size={64} className="opacity-10 mb-4" />
                        <h2 className="text-xl font-bold">Select a Colleague</h2>
                        <p className="text-sm">Pick someone to start chatting in real-time.</p>
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
        default: return 'bg-gray-300';
    }
};