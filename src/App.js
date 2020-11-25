import './App.css';
import React, { useState, useEffect, useCallback } from "react";
import ChartRace from 'react-chart-race';
import axios from 'axios';
import logoCovid from './Logo/covid-19.png'

import { Grid,Typography } from "@material-ui/core";

function App() {

  const [data, setData] = useState([])
  const [dataNew, setDataNew] = useState([])
  const [dataRaw, setDataRaw] = useState([])
  const [date, setDate] = useState("")
  const [count, setCount] = useState(0);


  const handleChange = useCallback(count => {
    let data = []
    let dateObj = {}

      dataNew.forEach((element, key) => {
        const obj = element.timeline.cases
        dateObj = obj
        data.push({
          ...dataRaw[key],
          value: obj[Object.keys(obj)[count]]
        })
        if (count === 30) {
          setCount(0);
        }
      });
      setDate(Object.keys(dateObj)[count])
    
    setData(data)
  }, [dataRaw, dataNew]);

  const createRandomColor = () => {
    const hexParts = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += hexParts[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const URL = 'https://disease.sh/v3/covid-19/historical?lastdays=30'

  const getList = useCallback(async () => {
    let dataRaw = []
    try {
      const response = await axios.get(URL);

      response.data.forEach((element, key) => {
        dataRaw.push({
          id: key,
          title: element.country,
          color: createRandomColor()
        })
      });

      setDataRaw(dataRaw)
      setDataNew(response.data)
    } catch (error) {
      // console.error(error);
    }
  }, [])


  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count => count + 1);
      handleChange(count);
    }, 300);

    return () => clearInterval(interval);

  }, [handleChange, count]);

  return (
    <Grid container direction="row">
      <Grid item xs={6}>
        <ChartRace
          data={data}
          backgroundColor='#000'
          padding={12}
          itemHeight={50}
          gap={12}
          titleStyle={{ font: 'normal 400 13px Arial', color: '#fff' }}
          valueStyle={{ font: 'normal 400 11px Arial', color: 'rgba(255,255,255, 0.42)' }}
        />
      </Grid>
      <Grid item container direction='column' alignItems='center' xs={6}>
        <Grid item style={{ position: 'fixed' }}>
          <Grid item>
          <img src={logoCovid} alt={"logoCovid"} style={{ width: "218px", marginBottom: "30px" }}  />
          </Grid>
          <Grid item>
          <Typography variant="h4">Date : {date}</Typography>
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  );
}

export default App;
