import React, {useState, useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import TimerIcon from '@material-ui/icons/Timer';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import {RaceHorseTable} from './RaceHorseTable';
import {BreedHorseTable} from './BreedHorseTable';

const {dbst} = window;

export const App: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [raceHorses, setRaceHorses] = useState<RaceHorse[]>([]);
  const [breedHorses, setBreedHorses] = useState<BreedHorse[]>([]);
  const [timer, setTimer] = useState<any>(null);

  async function refreshData() {
    const data = await dbst.getData();
    if (data == null) {
      setFailed(true);
      return;
    }
    setRaceHorses(data.race);
    setBreedHorses(data.breed);
    setFailed(false);
  }

  async function startTimer() {
    if (timer != null) {
      return;
    }
    await refreshData();
    const newTimer = setInterval(() => refreshData(), 2000);
    setTimer(newTimer);
  }

  async function stopTimer() {
    if (timer == null) {
      return;
    }
    clearInterval(timer);
    setTimer(null);
  }

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        style={{height: '100vh', width: '100%'}}
      >
        <Box>
          <AppBar position="static" color="default">
            <Box
              display="flex"
              flexDirection="row"
            >
              <Box flexGrow={1}>
                <Tabs
                  value={index}
                  onChange={(event, newValue) => setIndex(newValue)}
                >
                  <Tab label='競走馬' />
                  <Tab label='繁殖牝馬' />
                </Tabs>
              </Box>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={() => {
                  if (timer == null) {
                    startTimer();
                  } else {
                    stopTimer();
                  }
                }}
              >
                {(timer == null) ? <TimerIcon /> : <TimerOffIcon />}
              </IconButton>
              <IconButton
                color={(!failed) ? 'inherit' : 'secondary'}
                onClick={() => refreshData()}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </AppBar>
        </Box>
        <Box flexGrow={1}>
          {index == 0 &&
            <RaceHorseTable
              horses={raceHorses}
            />
          }
          {index == 1 &&
            <BreedHorseTable
              horses={breedHorses}
            />
          }
        </Box>
      </Box>
    </React.Fragment>
  );
};
