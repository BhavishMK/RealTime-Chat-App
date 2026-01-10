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
    connection: signalR.HubConnection | null;
    messages: Message[];
    onlineUsers: any[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setOnlineUsers: React.Dispatch<React.SetStateAction<any[]>>; 
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children, token }: { children: React.ReactNode, token: string }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

    useEffect(() => {
        // 1. If no token, or if we already have a starting/connected instance, don't re-run
        if (!token || (connection && connection.state !== signalR.HubConnectionState.Disconnected)) {
            return;
        }

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7151/chathub", {
                accessTokenFactory: () => token // Use the token from props
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // 2. Add a lock variable to prevent double-starting in Strict Mode
        let isMounted = true;

        const startConnection = async () => {
            try {
                // Only start if the component is still mounted
                if (newConnection.state === signalR.HubConnectionState.Disconnected) {
                    await newConnection.start();
                    
                    if (isMounted) {
                        console.log("WebSocket Connected successfully!");
                        
                        // Set up listeners ONLY once
                        newConnection.on("ReceiveMessage", (message) => {
                            setMessages((prev) => [...prev, message]);
                        });

                        newConnection.on("UserStatusChanged", (userId, status) => {
                            setOnlineUsers(prev => prev.map(u => 
                                u.id.toString() === userId.toString() ? { ...u, status } : u
                            ));
                        });

                        setConnection(newConnection);
                    }
                }
            } catch (err: any) {
                // Ignore the AbortError as it's a known side effect of React Strict Mode cleanup
                if (err.name !== 'AbortError') {
                    console.error("SignalR Connection Error: ", err);
                }
            }
        };

        startConnection();

        // 3. Cleanup function
        return () => {
            isMounted = false;
            if (newConnection.state === signalR.HubConnectionState.Connected) {
                newConnection.stop();
            }
        };
    }, [token]); // Only re-run if token changes

    return (
        <ChatContext.Provider value={{ connection, messages, onlineUsers, setMessages, setOnlineUsers }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext)!;