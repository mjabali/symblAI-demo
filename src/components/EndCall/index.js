import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { IconButton } from '@material-ui/core';

import LinearProgressWithLabel from '../LinearProgressWithValue';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import styles from './styles';
import { getSummary } from '../../api/fetchSummary';
import { getAnalytics } from '../../api/fetchAnalytics';
import { getToken } from '../../api/fetchCreds';

// import styles from './styles';

export default function EndCall() {
  const { push } = useHistory();

  const [summaryData, setSummary] = useState(null);
  const [metrics, setAnalytics] = useState(null);
  const [membersInfo, setMembersInfo] = useState(null);
  const classes = styles();
  const { conversationId } = useParams();

  const redirectNewMeeting = () => {
    push('/');
  };
  useEffect(() => {
    getToken()
      .then((response) => {
        getSummary(conversationId, response.data.accessToken).then((data) => {
          setSummary(data.data.summary);
        });
        getAnalytics(conversationId, response.data.accessToken).then((data) => {
          setAnalytics(data.data.metrics);
          setMembersInfo(data.data.members);
        });
      })
      .catch((e) => console.log(e));
  }, [conversationId]);

  return (
    <div className={classes.container}>
      <div className={classes.meetingInfo}>
        <h2> Meeting Metrics </h2>

        {metrics && (
          <div>
            <div className={classes.talkingStats}>
              <h5>Silence Time</h5>
              <CircularProgress
                variant="determinate"
                value={metrics[0].percent}
              />
              <h5> {metrics[0].seconds} seconds</h5>
            </div>

            {/* <h5>VS</h5> */}
            <div className={classes.talkingStats}>
              <h5>Talking time</h5>
              <CircularProgress
                variant="determinate"
                value={metrics[1].percent}
              />
              <h5> {metrics[1].seconds} seconds</h5>
            </div>
          </div>
        )}

        {membersInfo && (
          <div>
            <ul>
              {membersInfo.map((member) => (
                <li key={member.id}>
                  <h3>
                    {member.name} talked for {member.talkTime.seconds} seconds
                  </h3>
                  <LinearProgressWithLabel
                    variant="determinate"
                    value={member.talkTime.percentage}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <IconButton
          onClick={redirectNewMeeting}
          className={classes.new__meeting}
        >
          Start new meeting
        </IconButton>
      </div>
      <div className={classes.banner}>
        <Card className={classes.centeredFlex} variant="outlined">
          <CardContent>
            {summaryData && summaryData.length ? (
              <h3 style={{ color: 'white' }}>Summary</h3>
            ) : (
              <h3 style={{ color: 'white' }}>There is no summary</h3>
            )}
          </CardContent>
          <CardActions>
            <div className={classes.root}>
              {summaryData ? (
                <div className={classes.recording}>
                  <ul>
                    {summaryData.map((entry) => (
                      <li key={entry.id}>{entry.text}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
