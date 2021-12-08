import Main from '../Main';
import Header from '../Header';
import styles from './styles.js';
import React from 'react';

function Wrapper() {
  const classes = styles();
  return (
    <div className={classes.flex}>
      <Header />
      <Main />
    </div>
  );
}

export default Wrapper;
