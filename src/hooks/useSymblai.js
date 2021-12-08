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
      // const audioTrack = subscriber.getAudioTracks()[0];
      const stream = new MediaStream();
      stream.addTrack(audioTrack);
      const AudioContext = window.AudioContext;
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);

      const id = roomName;

      const connectionConfig = {
        id,
        insightTypes: ['action_item', 'question'],
        source: source,
        config: {
          meetingTitle: 'My Test Meeting ' + id,
          confidenceThreshold: 0.5, // Offset in minutes from UTC
          encoding: 'LINEAR16',
          languageCode: 'en-US',
          sampleRateHertz: 48000,
          redaction: {
            // Enable identification of PII/PCI information
            identifyContent: true, // By default false
            // Enable redaction of PII/PCI information
            redactContent: true, // By default false
            // Use custom string "[PII_PCI_ENTITY]" to replace PII/PCI information with
            redactionString: '*****', // By default ****
          },
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
          onMessageResponse: () => {
            getSentiment();
            // console.log('onMessageResponse', JSON.stringify(data, null, 2))
          },
          // /**
          //  * When Symbl detects an insight, this callback will be called.
          //  */
          onInsightResponse: (data) => {
            console.log(data);
            for (let insight of data) {
              //           console.log('Insight detected: ', insight);
              addInsight(insight);
            }
            // console.log('onInsightResponse', JSON.stringify(data, null, 2))
          },
        },
      };

      const start = async () => {
        try {
          const stream = await symbl.createStream(connectionConfig);
          console.log(stream);
          streamRef.current = stream;
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
    roomName,
    preferences,
    publisher,
  ]);

  return {
    captions,
    myCaptions,
    messages,
    insights,
    name,
    stopTranscription,
  };
}
