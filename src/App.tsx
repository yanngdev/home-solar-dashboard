import React from 'react';
import { Area, Bar, ComposedChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import SunCalc from 'suncalc';
import dayjs from 'dayjs';
import { Box, Grid } from '@mui/material';
import sortBy from 'lodash/sortBy';

function App() {
  const data = React.useMemo(() => {
    const times = SunCalc.getTimes(new Date(), 51.5, -0.1);
    const now = dayjs();

    return sortBy(
      [
        ...[...new Array(24)]
          .map((_, hour) => {
            return [...new Array(60)].map((_, minute) => {
              return {
                name: `${hour}:${minute}`,
                minute: hour * 60 + minute,
                altitude: SunCalc.getPosition(
                  new Date(dayjs().hour(hour).minute(minute).second(0).valueOf()),
                  51.5,
                  -0.1,
                ).altitude,
              };
            });
          })
          .flat(),

        ...Object.entries(times)
          .map(([timeKey, timeValue]) => ({
            name: timeKey,
            minute: timeValue.getHours() * 60 + timeValue.getMinutes(),
            times: SunCalc.getPosition(timeValue, 51.5, -0.1).altitude,
          }))
          .filter(value => value.times >= 0),

        {
          name: 'now',
          minute: now.hour() * 60 + now.minute(),
          now: 1,
        },
      ],
      'minute',
    );
  }, []);

  console.log('data', data);

  return (
    <Box sx={{ width: '100vw', height: 500 }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={12}>
          <Box sx={{ width: '100%', height: '100%' }}>
            {data.length && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart width={100} height={100} data={data}>
                  <XAxis
                    dataKey="minute"
                    domain={[0, 24 * 60]}
                    tickFormatter={time => dayjs().minute(time).format('HH')}
                    tickCount={24}
                    minTickGap={30}
                    axisLine={false}
                  />
                  <YAxis domain={[0, 1]} allowDataOverflow hide />
                  <Area
                    dataKey="altitude"
                    type="monotone"
                    stroke="orange"
                    fill="orange"
                    fillOpacity={0.1}
                    strokeWidth={3}
                  />
                  <Bar dataKey="times" stroke="#fff" strokeWidth={2}>
                    <LabelList dataKey="name" position="top" offset={24} />
                    <LabelList
                      dataKey="minute"
                      position="top"
                      offset={52}
                      formatter={(time: number) => dayjs().minute(time).format('HH:MM')}
                    />
                  </Bar>
                  <Bar dataKey="now" stroke="white" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
