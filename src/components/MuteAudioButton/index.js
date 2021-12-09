// import MicIcon from '@material-ui/icons/Mic';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import React from 'react';
import styles from './styles.js';

export default function MuteAudioButton({
  toggleAudio,
  hasAudio,
  classes,
  handleAudioChange,
}) {
  const title = hasAudio ? 'Disable Microphone' : 'Enable Microphone';
  const localClasses = styles();

  return (
    <>
      <Tooltip title={title} aria-label="add">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="mic"
          onClick={handleAudioChange}
          className={`${classes.toolbarButtons} ${
            !hasAudio ? classes.disabledButton : ''
          }
          `}
        >
          {!hasAudio ? (
            <MicOffIcon fontSize="large" />
          ) : (
            <MicIcon fontSize="large" />
          )}
        </IconButton>
      </Tooltip>
    </>
  );
}
