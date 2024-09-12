import { frequencyToMidi } from "./noteUtils";

let selectedOutputDevice = null;

export default function setupMidi(onMidiReady) {
  // Check if the browser supports the Web MIDI API.
  if (!navigator.requestMIDIAccess) {
    throw new Error("This browser does not support the Web MIDI API.");
  }

  // Request access to the MIDI interface.
  return navigator.requestMIDIAccess().then((midiAccess) => {
    // select the firts output device 
    selectedOutputDevice = midiAccess.outputs.keys().next().value;


    midiAccess.onstatechange = (event) => {
      // Print information about the (dis)connected MIDI controller
      console.log(event.port.name, event.port.manufacturer, event.port.state);
    };

    function getDevices() {
      const inputs = midiAccess.inputs;
      const outputs = midiAccess.outputs;

      const inputNames = Array.from(inputs.values()).map(({name, id}) => ({name, id}));
      const outputNames = Array.from(outputs.values()).map(({name, id}) => ({name, id}));
      return { inputNames, outputNames };
    }


    function onSelectOutput(deviceID) {
      selectedOutputDevice = deviceID
    }

    function sendCCValue(cc, value) {
      // FIXME:
      // I think we need to pass in the user selected device ID here

      // const deviceID = midiAccess.outputs.keys().next().value;
      const deviceID = selectedOutputDevice;


      const outputs = midiAccess.outputs;
      const output = outputs.get(deviceID);
      console.log('sendCC', cc, value)
      output.send([0xb0, cc, value]);
    }

    function setCrossfader(val) {
      sendCCValue(48, val);
    }

    function setSceneA(val) {
      sendCCValue(55, val);
    }

    function setSceneB(val) {
      sendCCValue(56, val);
    }

    onMidiReady({
        setCrossfader,
        setSceneA,
        setSceneB,
        getDevices,
        onSelectOutput,
      })

    return midiAccess;
  });

}
