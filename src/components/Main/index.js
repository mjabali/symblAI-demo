import React from 'react';
import { uuid } from 'uuidv4';

import { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { PreferencesContext } from '../../context/PreferencesContext'

import { usePublisher } from '../../hooks/usePublisher';
import { useSession } from '../../hooks/useSession';
import { useSymblai } from '../../hooks/useSymblai';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';

import ToolBar from '../ToolBar';
import { getCredentials } from '../../api/fetchCreds';

import SentimentChart from '../SentimentChart';
import symbl from "@symblai/symbl-web-sdk";

import Insights from '../Insights';

function Main() {
  const { preferences } = useContext(PreferencesContext);
  const { push } = useHistory();
  let { roomName } = useParams();
  const videoContainer = useRef();
  const [credentials, setCredentials] = useState(null);
  const [error, setError] = useState(null);
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);

  const { session, createSession, connected, subscriber, isSubscribing } =
    useSession({
      container: videoContainer,
    });

  const { publisher, publish, pubInitialised, isPublishing } = usePublisher();
  const { captions, messages, insights, name, myCaptions } = useSymblai({
    publisher,
    isPublishing,
    subscriber,
    isSubscribing,
  });

  useEffect(() => {
    console.log(subscriber);
  }, [subscriber]);

  useEffect(() => {
    getCredentials(roomName)
      .then(({ data }) => {
        setCredentials({
          apiKey: data.apiKey,
          sessionId: data.sessionId,
          token: data.token,
        });
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (credentials) {
      const { apiKey, sessionId, token } = credentials;
      console.log(apiKey);
      createSession({ apiKey, sessionId, token });
    }
  }, [createSession, credentials]);

  const handleAudioChange = useCallback(() => {
    console.log(symbl);
    if (hasAudio) {
      symbl.mute()
      publisher.publishAudio(false);
      setHasAudio(false);

    } else {
      publisher.publishAudio(true);
      symbl.unmute()
      setHasAudio(true);

    }
  }, [hasAudio, publisher]);

  const endCall = () => {

    push(`${roomName}/${preferences.conversationId}/end`);

  };

  const handleVideoChange = useCallback(() => {
    if (hasVideo) {
      publisher.publishVideo(false);
      setHasVideo(false);
      try {
      } catch (e) {
        console.log(e);
      }
    } else {
      publisher.publishVideo(true);
      setHasVideo(true);
      try {
      } catch (e) {
        console.log(e);
      }
    }
  }, [hasVideo, publisher]);

  useEffect(() => {
    if (
      session.current &&
      connected &&
      !pubInitialised &&
      videoContainer.current
    ) {
      publish({
        session: session.current,
        containerId: videoContainer.current.id,
      });
    }
  }, [publish, session, connected, pubInitialised]);

  return (
    <>
      <div className="container">
        <div className={'video'} ref={videoContainer} id="video-container">
          <div className="insightsContainer">
            {messages && isPublishing && <SentimentChart messages={messages} />}
            {insights.length ? <Insights insights={insights} /> : null}
          </div>
        </div>
        {/* <div className="captions"> {`${name ? name : ''}:   ${captions}`}</div> */}
        <div className="mycaptions">
          {myCaptions && (
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>You</span>
          )}
          {myCaptions && `: ${myCaptions}`}
        </div>

        <div className="captions">
          {name && (
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{name}</span>
          )}
          {captions && `: ${captions}`}
        </div>
      </div>

      <ToolBar
        handleAudioChange={handleAudioChange}
        handleVideoChange={handleVideoChange}
        session={session.current}
        hasAudio={hasAudio}
        hasVideo={hasVideo}
        endCall={endCall}
      />
    </>
  );
}

export default Main;
