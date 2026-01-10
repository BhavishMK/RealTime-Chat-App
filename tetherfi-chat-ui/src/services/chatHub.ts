import * as signalR from "@microsoft/signalr";

export const createHubConnection = (token: string) => {
    return new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7002/chathub", { // Your Chat Service URL
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build();
};