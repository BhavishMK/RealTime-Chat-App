import React, { createContext, useContext, useState, useEffect } from 'react';
import * as signalR from "@microsoft/signalr";

interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    replyToId?: number;
    timestamp: string;
}

interface ChatContextType {
    // FIX: Added 'connection' to the interface
    connection: signalR.HubConnection | null;
    messages: Message[];
    onlineUsers: any[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setOnlineUsers: React.Dispatch<React.SetStateAction<any[]>>;
    sendMessage: (receiverId: number, content: string, replyToId: number | null) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children, token }: { children: React.ReactNode, token: string }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

    useEffect(() => {
        if (!token) return;

        // Force WebSockets and Skip Negotiation to bypass Docker SSL/Port issues
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:7151/chathub", { 
                accessTokenFactory: () => token,
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        newConnection.on("ReceiveMessage", (message) => {
            setMessages((prev) => {
                if (prev.some(m => m.id === message.id)) return prev;
                return [...prev, message];
            });
        });

        newConnection.on("UserStatusChanged", (userId, status) => {
            setOnlineUsers(prev => prev.map(u => 
                u.id.toString() === userId.toString() ? { ...u, status } : u
            ));
        });

        const start = async () => {
            try {
                await newConnection.start();
                console.log("🚀 SIGNALR CONNECTED");
                setConnection(newConnection);
            } catch (err) {
                console.error("SignalR Start Error: ", err);
                setTimeout(start, 5000);
            }
        };

        start();

        return () => {
            newConnection.stop();
        };
    }, [token]);

    // Added a robust sendMessage helper
    const sendMessage = async (receiverId: number, content: string, replyToId: number | null) => {
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
            try {
                await connection.invoke("SendPrivateMessage", receiverId, content, replyToId);
            } catch (err) {
                console.error("Invoke Error:", err);
            }
        } else {
            alert("Chat server is not connected yet. Please wait.");
        }
    };

    return (
        <ChatContext.Provider value={{ 
            connection, // Now passed correctly
            messages, 
            onlineUsers, 
            setMessages, 
            setOnlineUsers,
            sendMessage 
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used within ChatProvider");
    return context;
};