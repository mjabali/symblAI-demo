import React from 'react';

import MuteAudioButton from '../MuteAudioButton';
import MuteVideoButton from '../MuteVideoButton';

import styles from './styles';
import EndCallIcon from '../EndCallIcon';



function ToolBar({
  session,
  handleVideoChange,
  handleAudioChange,
  hasVideo,
  hasAudio,
  endCall
}) {



  const classes = styles();
  return (
    <div className="footer">
      <MuteAudioButton
        classes={classes}
        handleAudioChange={handleAudioChange}
        hasAudio={hasAudio}
      />
      <MuteVideoButton
        classes={classes}
        handleVideoChange={handleVideoChange}
        hasVideo={hasVideo}
      />
      <EndCallIcon classes={classes} handleEndCall={endCall} />
    </div>
  );
}

export default ToolBar;
