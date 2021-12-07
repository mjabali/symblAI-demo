import React from 'react';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  Legend,
} from 'recharts';
import { PreferencesContext } from '../../context/PreferencesContext';
function SentimentChart({ messages }) {
  const [data, setData] = React.useState([]);
  const { preferences } = React.useContext(PreferencesContext);

  React.useEffect(() => {
    const remoteMessages = messages.filter(
      (e) => e.from.name !== preferences.userName
    );
    // setData(
    //   remoteMessages.map((message) => {
    //     return {
    //       uv: message.sentiment.polarity.score,
    //       pv: -1,
    //       amt: 1,
    //     };
    //   })
    // );
    setData(
      messages.map((message) => {
        return {
          uv:
            message.from.name === preferences.userName
              ? message.sentiment.polarity.score
              : undefined,
          pv:
            message.from.name !== preferences.userName
              ? message.sentiment.polarity.score
              : undefined,
          amt: 1,
        };
      })
    );
  }, [messages, preferences.userName]);

  return (
    <>
      {/* <span>Sentiment Chart </span> */}
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 25, right: 20, bottom: 5, left: 20 }}
      >
        <Line
          name="Your speech"
          type="monotone"
          dataKey="uv"
          stroke="#8884d8"
        />
        <Line
          name="Remote speech"
          type="monotone"
          dataKey="pv"
          stroke="#82ca9d"
        />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis
          label={{ value: 'Time', position: 'insideBottomLeft' }}
          dataKey="Time"
        />
        <YAxis
          label={{ value: 'Sentiment', angle: -90, position: 'insideLeft' }}
        />
        <Legend />
        <ReferenceLine
          y={0}
          label="Neutral"
          stroke="red"
          strokeDasharray="3 3"
        />
      </LineChart>
    </>
  );
}

export default SentimentChart;
