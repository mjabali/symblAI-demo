import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import { useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import symbl from '@symblai/symbl-web-sdk';

import { getToken } from '../api/fetchCreds';
import { getSentimentAPI } from '../api/fetchSentiment';
import { PreferencesContext } from '../context/PreferencesContext';

export function useSymblai({ publisher, isPublishing }) {
  // const [symblToken, setSymblToken] = useState(null);
  let streamRef = useRef(null);
  const { preferences } = useContext(PreferencesContext);
  const [captions, setCaptions] = useState('');
  const [myCaptions, setMyCaptions] = useState('');
  const [name, setName] = useState(null);
  const conversationId = useRef(null);
  const [symblToken, setSymblToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [insights, setInsights] = useState([]);
  let { roomName } = useParams();

  useEffect(() => {
    getToken()
      .then((response) => {
        setSymblToken(response.data.accessToken);
        symbl.init({
          accessToken: response.data.accessToken, // can be used instead of appId and appSecret
          basePath: 'https://api-labs.symbl.ai',
        });
      })
      .catch((e) => console.log(e));
  }, []);

  const addInsight = useCallback((insight) => {
    setInsights((prev) => [...prev, insight]);
  }, []);

  const getSentiment = useCallback(async () => {
    if (conversationId.current) {
      try {
        const data = await getSentimentAPI(conversationId.current, symblToken);
        setMessages(data.data.messages);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('no conversation');
    }
  }, [setMessages, symblToken]);

  const stopTranscription = useCallback(async () => {
    try {
      await symbl.stopRequest(streamRef.current);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (isPublishing && publisher) {
      const audioTrack = publisher.getAudioSource();
      const stream = new MediaStream();
      stream.addTrack(audioTrack);
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const id = roomName;

      const connectionConfig = {
        id,
        insightTypes: ['action_item', 'question'],
        sourceNode: source,
        reconnectOnError: true,
        config: {
          meetingTitle: 'My Test Meeting ' + id,
          confidenceThreshold: 0.5, // Offset in minutes from UTC
          encoding: 'LINEAR16',
          languageCode: 'en-US',
          sampleRateHertz: 48000,
        },
        speaker: {
          // Optional, if not specified, will simply not send an email in the end.
          userId: '', // Update with valid email
          name: preferences.userName || uuidv4(),
        },
        handlers: {
          /**
           * This will return live speech-to-text transcription of the call.
           */
          onSpeechDetected: (data) => {
            // console.log(data);
            if (data) {
              if (data.user.name !== preferences.userName) {
                setCaptions(data.punctuated.transcript);
                setName(data.user.name);
              } else {
                setMyCaptions(data.punctuated.transcript);
              }
            }
          },
          /**
           * When processed messages are available, this callback will be called.
           */
          onMessageResponse: (data) => {
            getSentiment();
          },
          // /**
          //  * When Symbl detects an insight, this callback will be called.
          //  */
          onInsightResponse: (data) => {
            for (let insight of data) {
              addInsight(insight);
            }
          },
        },
      };

      const start = async () => {
        try {
          console.log(symbl);
          const stream = await symbl.createStream(connectionConfig);
          streamRef.current = stream;
          console.log(stream);
          await stream.start();
          conversationId.current = await stream.conversationId;
          console.log(conversationId.current);
          preferences.conversationId = conversationId.current;
        } catch (e) {
          console.log(e);
        }
      };
      start();
    }
  }, [
    isPublishing,
    addInsight,
    getSentiment,
    preferences,
    publisher,
    roomName,
  ]);

  return {
    captions,
    myCaptions,
    messages,
    insights,
    name,
    stopTranscription,
    stream: streamRef.current,
  };
}
