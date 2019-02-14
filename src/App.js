import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import {Game, interpretInitializationError} from './Game';
import {toSvg} from './svgEmoji'
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = initialState();

    this.scheduleNextTick = this.scheduleNextTick.bind(this);
    this.onGameInitialized = this.onGameInitialized.bind(this);
    this.onGameInitializationError = this.onGameInitializationError.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onChangeThreshold = this.onChangeThreshold.bind(this);
  }

  componentDidMount() {
    if (!this.videoElementEl) return;
    
    this.game = new Game(this.videoElementEl);
    this.game.init()
      .then(this.onGameInitialized)
      .catch(this.onGameInitializationError)
  }

  thresholdToShow() {
    const {thresholdToShowText} = this.state;
    const parsedThreshold = parseInt(thresholdToShowText, 10);
    return isNaN(parsedThreshold) ? 0 : parsedThreshold;
  }

  scheduleNextTick() {
    const {guessesThreshold, refreshIntervalMs} = this.props;
    this.game.predict().then(topK => {
      const thresholdToShow = this.thresholdToShow();
      const k = topK[0];
      const guessHistory = (k.value * 100 >= thresholdToShow)
        ? this.state.guessHistory.concat([k])
        : this.state.guessHistory;
      const timeOfBoomMs = (uniqueGuessesSoFar(guessHistory).length <= guessesThreshold && this.state.timeOfBoomMs === null)
        ? new Date().getTime()
        : null;
      this.setState({topK, guessHistory, timeOfBoomMs});
      window.setTimeout(this.scheduleNextTick, refreshIntervalMs);
    });
  }

  onGameInitialized() {
    this.setState({startedTimestampMs: new Date().getTime()});
    this.scheduleNextTick();
  }

  onGameInitializationError(error) {
    const {messageText} = interpretInitializationError(error);
    console.error('onGameInitializationError', error);
    this.setState({errorMessageText: messageText});
  }

  onReset() {
    this.setState(initialState());
  }

  onChangeThreshold(thresholdToShowText) {
    this.setState({thresholdToShowText});
  }

  render() {
    const {errorMessageText} = this.state;
    return (
      <div className="App">
        {errorMessageText && <div className="App-error-message">{errorMessageText}</div>}
        <video
          className="App-video"
          ref={el => this.videoElementEl = el} 
          autoPlay
          playsInline
        />
        {this.renderSidebar()}
      </div>
    );
  }

  renderSidebar() {
    const {topK} = this.state;
    const thresholdToShow = this.thresholdToShow();
    const guesses = (topK || []).filter(k => k.value * 100 >= thresholdToShow);
    
    return (
      <div className="App-floating">
        <div className="App-floating-panel" style={{flex: 2}}>
          <div className="App-floating-title">best guess right now</div>
          <div>
            <div>{!topK && 'loading...'}</div>
            {topK && guesses.length === 0 && (
              <div style={{marginLeft: '35%', textAlign: 'left'}}>
                <span>not sure</span>
                <span>{_.repeat('.', Math.round(Math.random() * 3))}</span>
              </div>
            )}
            {guesses.map((k, index) => (
              <div key={k.label} style={{display: 'flex', fontWeight: index === 0 ? 'bold' : 'normal'}}>
                <div style={{display: 'inline-block', padding: 5, width: '2em'}}>{Math.round(k.value * 100)}%</div>
                <div style={{display: 'inline-block', padding: 5, flex: 1}}>{k.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="App-floating-panel" style={{flex: 3}}>
          <div className="App-floating-title">guesses so far</div>
          <div>{this.renderGuesses()}</div>
        </div>
        <div className="App-floating-panel">
          <div className="App-floating-title">confidence level</div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Slider
              style={{width: '80%', height: 35}}
              onChange={this.onChangeThreshold}
              min={0}
              value={thresholdToShow}
              marks={{ 10: 10, 50: 50, 85: 85, 99: 99 }}
              step={null} 
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: 10}}>
            <div><a href="/" style={{fontWeight: 'bold', color: 'black'}}>hello-mobile-net</a></div>
            <button style={{background: '#ccc', border: '1px solid #999', padding: 5}}onClick={this.onReset}>reset</button>
          </div>
        </div>
      </div>
    );
  }

  renderGuesses() {
    const {guessesThreshold} = this.props;
    const {guessHistory} = this.state;
    const guessesSoFar = uniqueGuessesSoFar(guessHistory);
    
    if (guessesSoFar.length <= guessesThreshold) {
      return (
        <div>{guessesSoFar.map(label => (
          <div key={label}>
            <span>{label}</span>
            <img src={toSvg(label)} height="16" width="16" alt="" />
          </div>
        ))}</div>
      );
    }

    return `boom! more than ${guessesThreshold}`;
    // return `boom! more than ${guessesThreshold} in ${Math.round((timeOfBoomMs - startedTimestampMs) / 1000)} seconds`;
  }
}
App.defaultProps = {
  refreshIntervalMs: 100,
  guessesThreshold: 25
};


function uniqueGuessesSoFar(guessHistory) {
  return guessHistory ? _.uniq(guessHistory.map(k => k.label)).sort() : [];
}

function initialState() {
  return {
    errorMessageText: null,
    topK: null,
    thresholdToShowText: '10',
    guessHistory: [],
    startedTimestampMs: null,
    timeOfBoomMs: null
  };
}