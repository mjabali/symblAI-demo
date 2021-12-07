import VideoCam from '@mui/icons-material/Videocam';
import VideocamOff from '@mui/icons-material/VideocamOff';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import React from 'react';
import styles from './styles.js';

export default function MuteVideoButton({
  classes,
  hasVideo,
  handleVideoChange,
}) {
  const title = hasVideo ? 'Disable Camera' : 'Enable Camera';

  return (
    <>
      <Tooltip title={title} aria-label="add">
        <IconButton
          onClick={handleVideoChange}
          edge="start"
          aria-label="videoCamera"
          size="small"
          className={`${classes.arrowButton} ${
            !hasVideo ? classes.disabledButton : ''
          }`}
        >
          {!hasVideo ? (
            <VideocamOff fontSize="large" />
          ) : (
            <VideoCam fontSize="large" />
          )}
        </IconButton>
      </Tooltip>
    </>
  );
}
