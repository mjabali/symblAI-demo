import { Grid } from '@material-ui/core';
import React from 'react';
import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';
import Avatar from '../Avatar';
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  backgroundColor: '#ebd5d3',
  textAlign: 'center',
  margin: '10px',
  fontSize: '15px',
  display: 'flex',
  alignItems: 'center',
}));

function Insights({ insights }) {
  return (
    <div className="insights">
      <div>Insights</div>
      <Grid container columns={{ xs: 3, sm: 8, md: 12 }}>
        {insights.map((e) => (
          <Item key={e.id}>
            <Avatar name={e.from.name} />
            <div> {e.payload.content}</div>
          </Item>
        ))}
      </Grid>
    </div>
  );
}

export default Insights;
