// import OtherControl from '../OtherControl';
import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import useStyles from './styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { PreferencesContext } from '../../context/PreferencesContext';

import { Button, Grid, TextField } from '@material-ui/core';

function LanguageSelector() {
  const { push } = useHistory();

  const [roomName, setRoomName] = useState('');
  const { preferences, setPreferences } = useContext(PreferencesContext);
  const [userName, setUserName] = useState('');

  const classes = useStyles();

  const handleJoinClick = () => {
    if (roomName && userName) {
      localStorage.setItem('roomname', roomName);
      localStorage.setItem('userName', userName);

      push(`/room/${roomName}`);
    }
  };

  //   useEffect(() => {
  //     // if (userName !== preferences.hasSetUpPreferences) {
  //     setPreferences({ ...preferences, hasSetUpPreferences: true });

  //     if (localStorage.getItem('roomname')) {
  //       setRoomName(localStorage.getItem('roomname'));
  //     }
  //     if (localStorage.getItem('userName')) {
  //       setUserName(localStorage.getItem('userName'));
  //     }
  //     console.log(preferences);
  //     // }
  //   }, [preferences, setPreferences]);

  useEffect(() => {
    if (userName !== preferences.userName) {
      setPreferences({ userName: userName });
    }
  }, [userName, setPreferences, preferences.userName]);

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleJoinClick();
    }
  };

  const onChangeRoomName = (e) => {
    const roomName = e.target.value;
    if (roomName === '' || roomName.trim() === '') {
      // Space detected
      setRoomName('');
      return;
    }
    setRoomName(roomName);
  };

  const onChangeUserName = (e) => {
    const userName = e.target.value;
    if (userName === '' || userName.trim() === '') {
      // Space detected
      setUserName('');
      return;
    }
    setUserName(userName);
  };

  return (
    <div>
      <div className={classes.waitingRoomContainer}>
        <form className={classes.form} noValidate>
          <TextField
            InputLabelProps={{ style: { fontSize: 16 } }}
            // inputProps={{ style: { fontSize: 40 } }}
            //   variant="outlined"
            InputProps={{
              classes: {
                input: classes.resize,
              },
            }}
            margin="normal"
            required
            //   disabled={roomToJoin !== ''}
            id="room-name"
            label="Room Name"
            name="roomName"
            autoComplete="Room Name"
            //   error={isRoomNameInvalid}
            autoFocus
            //   helperText={roomName === '' ? 'Empty Field' : ' '}
            value={roomName}
            onChange={onChangeRoomName}
            onKeyDown={onKeyDown}
          />
          <TextField
            InputLabelProps={{ style: { fontSize: 16 } }}
            // inputProps={{ style: { fontSize: 40 } }}
            //   variant="outlined"
            InputProps={{
              classes: {
                input: classes.resize,
              },
            }}
            margin="normal"
            required
            //   disabled={roomToJoin !== ''}
            id="user-name"
            label="User Name"
            name="userName"
            autoComplete="Room Name"
            //   error={isRoomNameInvalid}
            autoFocus
            //   helperText={roomName === '' ? 'Empty Field' : ' '}
            value={userName}
            onChange={onChangeUserName}
            onKeyDown={onKeyDown}
          />
        </form>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            onClick={handleJoinClick}
            variant="contained"
            color="primary"
            size="large"
            disabled={!roomName || !userName}
          >
            Join Call
          </Button>
        </Grid>
      </div>
    </div>
  );
}

export default LanguageSelector;
