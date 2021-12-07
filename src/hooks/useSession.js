import React, { useState, useRef, useCallback } from 'react';

import _ from 'lodash';
import OT from '@opentok/client';
// const OT = window.OT;

export function useSession({ container }) {
  const [isSomeonePublishingScreen, setIsSomeonePublishingScreen] =
    useState(false);
  const [connected, setConnected] = useState(false);
  const [streams, setStreams] = useState([]);
  const sessionRef = useRef(null);
  const subscriberRef = useRef(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const addStream = ({ stream }) => {
    setStreams((prev) => [...prev, stream]);
  };

  const removeStream = ({ stream }) => {
    setStreams((prev) =>
      prev.filter((prevStream) => prevStream.id !== stream.id)
    );
  };

  const subscribe = React.useCallback(
    (stream, options = {}) => {
      if (sessionRef.current && container.current) {
        const finalOptions = Object.assign({}, options, {
          insertMode: 'append',
          width: '100%',
          // width: calculateChildBaseWidth(streams.length),
          height: '80%',
          fitMode: 'contain',
          style: {
            buttonDisplayMode: 'off',
            nameDisplayMode: 'on',
          },
          showControls: false,
          // insertDefaultUI: false,
        });
        const subscriber = sessionRef.current.subscribe(
          stream,
          container.current.id,
          finalOptions
        );
      }
    },
    [container]
  );

  const onStreamCreated = useCallback(
    (event) => {
      console.log('event');
      subscribe(event.stream);
      addStream({ stream: event.stream });
      if (event.stream.videoType === 'screen')
        setIsSomeonePublishingScreen(true);
    },
    [subscribe]
  );

  const onStreamDestroyed = useCallback((event) => {
    if (event.stream.videoType === 'screen') {
      setIsSomeonePublishingScreen(false);
    }
    removeStream({ stream: event.stream });
  }, []);

  const createSession = useCallback(
    ({ apiKey, sessionId, token }) => {
      if (!apiKey) {
        throw new Error('Missing apiKey');
      }

      if (!sessionId) {
        throw new Error('Missing sessionId');
      }

      if (!token) {
        throw new Error('Missing token');
      }

      sessionRef.current = OT.initSession(apiKey, sessionId, {
        // iceConfig: {
        //   includeServers: 'all',
        //   transportPolicy: 'relay',
        //   customServers: [
        //     {
        //       urls: []
        //     }
        //   ]
        // }
      });
      const eventHandlers = {
        streamCreated: onStreamCreated,
        streamDestroyed: onStreamDestroyed,
      };
      sessionRef.current.on(eventHandlers);
      return new Promise((resolve, reject) => {
        sessionRef.current.connect(token, (err) => {
          if (!sessionRef.current) {
            // Either this session has been disconnected or OTSession
            // has been unmounted so don't invoke any callbacks
            return;
          }
          if (err) {
            reject(err);
          } else if (!err) {
            console.log('Session Connected!');
            setConnected(true);
            resolve(sessionRef.current);
          }
        });
      });
    },
    [onStreamCreated, onStreamDestroyed]
  );

  const destroySession = React.useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.on('disconnected', () => {
        sessionRef.current = null;
      });
      sessionRef.current.disconnect();
    }
  }, []);

  return {
    session: sessionRef,
    connected,
    createSession,
    destroySession,
    streams,
    isSomeonePublishingScreen,
    subscriber: subscriberRef.current,
    isSubscribing,
  };
}
