import React, { useEffect, useState } from 'react';
import './App.css';
import { setupAudio } from './setupAudio';
import setupMidi from './midi';
import { frequencyToMidi, pitchToNoteName } from './noteUtils';

function PitchReadout({ running, latestPitch }) {
  return (
    <div className="Pitch-readout">
      {latestPitch
        ? `${latestPitch.toFixed(1)} Hz - ${frequencyToMidi(
            latestPitch
          )} - ${pitchToNoteName(frequencyToMidi(latestPitch))}`
        : running
        ? 'Listening...'
        : 'Paused'}
    </div>
  );
}

function DeviceList({ devices, name, onSelectDevice }) {
  useEffect(() => {
    if (devices.length > 0) {
      onSelectDevice(devices[0].id);
    }
  }, []);
  return (
    <>
      <div className="flex flex-column">
        <label>{name}:</label>
        <select
          id={name}
          name={name}
          onChange={(event) => onSelectDevice(event.target.value)}
        >
          {devices.map(({ name, id }) => (
            <>
              <option key={id} value={id}>
                {name}
              </option>
            </>
          ))}
        </select>
      </div>
    </>
  );
}

function AudioRecorderControl({ onPitchFn }) {
  const [audio, setAudio] = React.useState(undefined);
  const [running, setRunning] = React.useState(false);
  const [latestPitch, setLatestPitch] = React.useState(undefined);

  const onPitchChange = (pitch) => {
    onPitchFn && onPitchFn(pitch);
    setLatestPitch(pitch);
  };

  // Initial state. Initialize the web audio once a user gesture on the page
  // has been registered.
  if (!audio) {
    return (
      <button
        onClick={async () => {
          setAudio(await setupAudio(onPitchChange));
          setRunning(true);
        }}
      >
        Start Pitch Detection
      </button>

      // <button>
      // start hand tracking
      //   {/* https://victordibia.com/handtrack.js/#/ */}
      // </button>
    );
  }

  // Audio already initialized. Suspend / resume based on its current state.
  const { context } = audio;
  return (
    <div>
      <button
        onClick={async () => {
          if (running) {
            await context.suspend();
            setRunning(context.state === 'running');
          } else {
            await context.resume();
            setRunning(context.state === 'running');
          }
        }}
        disabled={context.state !== 'running' && context.state !== 'suspended'}
      >
        {running ? 'Pause' : 'Resume'}
      </button>
      <PitchReadout running={running} latestPitch={latestPitch} />
    </div>
  );
}

function OctatrackControl({ setCrossfader, setSceneA, setSceneB }) {
  return (
    <div>
      <h2>Octatrack Control</h2>
      <div className="flex flex-column">
        <label htmlFor="crossfader">Crossfader</label>
        <input
          id="crossfader"
          type="range"
          min="0"
          max="127"
          onChange={({ target }) => setCrossfader(target.value)}
        />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-column">
          <label htmlFor="sceneA">Scene A</label>
          <input
            id="sceneA"
            type="number"
            min="1"
            max="16"
            defaultValue={1}
            onChange={({ target }) => setSceneA(target.value)}
          />
        </div>
        <div className="flex flex-column">
          <label htmlFor="sceneB">Scene B</label>
          <input
            id="sceneB"
            type="number"
            min="1"
            max="16"
            defaultValue={9}
            onChange={({ target }) => setSceneB(target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function MidiConfig({ setOnPitchFn }) {
  const [inputNames, setInputNames] = React.useState([]);
  const [outputNames, setOutputNames] = React.useState([]);

  const [selectOutput, setSelectOutput] = React.useState(() => () => {});
  const [setCrossfader, setSetCrossfader] = React.useState(() => () => {});
  const [setSceneA, setSetSceneA] = React.useState(() => () => {});
  const [setSceneB, setSetSceneB] = React.useState(() => () => {});

  const onMidiReady = ({
    setCrossfader,
    setSceneA,
    setSceneB,
    getDevices,
    onSelectOutput,
  }) => {
    // Update selectInput and selectOutput functions
    setSelectOutput(() => onSelectOutput);
    setSetSceneA(() => setSceneA);
    setSetSceneB(() => setSceneB);
    setSetCrossfader(() => setCrossfader);

    // this function is called with a new pitcch value is detected
    const onPitchFn = (pitch) => {
      const note = frequencyToMidi(pitch);
      const pitchClass = Math.round(note) % 12;

      // if pitch class is a step in C major (diatonic)
      // then set scene to pitchClass
      const diatonicStep = {
        0: 1,
        2: 2,
        4: 3,
        5: 4,
        7: 5,
        9: 6,
        11: 7,
        12: 8,
      };
      diatonicStep[pitchClass] && setSceneB(diatonicStep[pitchClass] - 1);
    };

    setOnPitchFn(() => onPitchFn);

    // Crossfader
    const crossfader = document.getElementById('crossfader');
    crossfader.addEventListener('input', (event) => {
      setCrossfader(event.target.value);
    });

    // Scene A
    const sceneA = document.getElementById('sceneA');
    sceneA.addEventListener('input', (event) => {
      setSceneA(event.target.value);
    });

    // Scene B
    const sceneB = document.getElementById('sceneB');
    sceneB.addEventListener('input', (event) => {
      setSceneB(event.target.value);
    });

    const { inputNames, outputNames } = getDevices();
    setInputNames(inputNames);
    setOutputNames(outputNames);
  };

  useEffect(() => {
    setupMidi(onMidiReady);
  }, []);

  return (
    <div>
      <DeviceList
        devices={outputNames}
        name={'output'}
        onSelectDevice={selectOutput}
      />
      <OctatrackControl
        setCrossfader={setCrossfader}
        setSceneA={setSceneA}
        setSceneB={setSceneB}
      />
    </div>
  );
}
function App() {
  const [onPitchFn, setOnPitchFn] = React.useState(() => () => true);

  return (
    <div className="App">
      <header className="App-header">Octatrack Harmonizer</header>
      <div className="App-content">
        <AudioRecorderControl onPitchFn={onPitchFn} />
        <MidiConfig setOnPitchFn={setOnPitchFn} />
      </div>
    </div>
  );
}

export default App;
