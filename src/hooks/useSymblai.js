import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import { useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import OT from '@opentok/client';
import symbl from '@symblai/symbl-web-sdk';

import { usePublisher } from '../hooks/usePublisher';
import { getToken } from '../api/fetchCreds';
import { getSentimentAPI } from '../api/fetchSentiment';
import { PreferencesContext } from '../context/PreferencesContext';

export function useSymblai({
  publisher,
  isPublishing,
  subscriber,
  isSubscribing,
}) {
  // const [symblToken, setSymblToken] = useState(null);
  let connection = useRef(null);
  const { preferences } = useContext(PreferencesContext);
  const uniqueMeetingId = preferences.roomName;
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

    // return () => {
    //   symbl.stopRequest(connection.current);
    // };
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
          speechRecognition: { encoding: 'LINEAR16', sampleRateHertz: 44100 },
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
            if (data) {
              // const { punctuated } = data
              // console.log('Live: ', punctuated && punctuated.transcript)
              // console.log('');

              if (data.user.name !== preferences.userName) {
                setCaptions(data.punctuated.transcript);
                setName(data.user.name);
              } else {
                setMyCaptions(data.punctuated.transcript);
              }
            }
            // console.log('onSpeechDetected ', JSON.stringify(data, null, 2));
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
            for (let insight of data) {
              //           console.log('Insight detected: ', insight);
              addInsight(insight);
            }
            // console.log('onInsightResponse', JSON.stringify(data, null, 2))
          },
        },
      };

      symbl.createStream(connectionConfig).then((conn) => {
        conn.start();
        connection.current = conn;
        conversationId.current = conn.conversationId;
        preferences.conversationId = conn.conversationId;
        console.log(
          'Successfully connected. Conversation ID: ',
          conn.conversationId
        );
      });
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
  };
}
