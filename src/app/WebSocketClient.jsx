// 'use client';
// import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const WebSocketClient = ({ url }) => {
  // useEffect(() => {
  useWebSocket(url, {
    onOpen: () => {
      console.log('WebSocket Established');
    },
    onClose: () => {
      console.log('WebSocket Disconnected');
    },
    onMessage: (event) => {
      console.log(JSON.parse(event.data));
      // onDataReceived(JSON.parse(event.data));
    },
    // });

    // return null;
  });

  return (<></>);
};

export default WebSocketClient;