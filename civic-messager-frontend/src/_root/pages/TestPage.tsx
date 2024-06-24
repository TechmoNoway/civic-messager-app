import { Client } from "@stomp/stompjs";
import { useEffect } from "react";
import SockJS from "sockjs-client";

const TestPage = () => {
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8081/ws"),

      onConnect: () => {
        console.log("Connected to WebSocket server");
      },
      debug: (str) => {
        console.log(str);
      },
      connectionTimeout: 10000,
    });

    client.onWebSocketClose = function (event) {
      console.log("Websocket closed. Reason: " + event.reason);
    };

    client.activate();
    console.log(client);

    return () => {
      client.deactivate();
    };
  }, []);

  return <div>TestPage</div>;
};

export default TestPage;
