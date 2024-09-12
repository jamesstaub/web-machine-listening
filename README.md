# Web Machine Listening
An experiment using WebAssembly to run a Rust audio processing and trigger MIDI events to control an Elektron Octatrack.


The basic use case is a diatonic pitch harmonizer of input audio, where the octatrack's pitch controls are modulated to different chord voicings within a diatonic scale depending on the current note. This is accomplished with a pitch detection audio node built in Rust and running in the browser via the web audio API. A monophonic instrument's pitch detected by the app will trigger MIDI messages to control Scenes or pitch modulation of track on the Octatrack.

## Attribution 
This code is forked from the very helpful Rust/Webaudio tutorial published as part of the [corresponding blog article](https://www.toptal.com/webassembly/webassembly-rust-tutorial-web-audio) at the Toptal Engineering Blog.


## Quick Start: Cloning, Building, and Running

Assuming prerequisites are installed, the following steps should get the app running on your system:

``` sh
git clone git@github.com:peter-suggate/wasm-audio-app.git
cd wasm-audio-app/wasm-audio/
wasm-pack build --target web
cd ..
cp -R ./wasm-audio/pkg ./public/wasm-audio
yarn
yarn start
```

* * *

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Developing the React frontend

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
