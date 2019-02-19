import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import {Game, interpretInitializationError} from './Game';
import {toSvg} from './svgEmoji'
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';
import {MobileNet as EmojiNet} from './scavenger/mobile_net';
import {MobileNet} from './mobilenet/mobile_net';


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = initialState();

    this.scheduleNextTick = this.scheduleNextTick.bind(this);
    this.onGameInitialized = this.onGameInitialized.bind(this);
    this.onGameInitializationError = this.onGameInitializationError.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onChangeThreshold = this.onChangeThreshold.bind(this);
    this.onToggleNet = this.onToggleNet.bind(this);
  }

  componentDidMount() {
    if (!this.videoElementEl) return;
    this.rebuildGame();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.netKey !== this.state.netKey) {
      this.rebuildGame();
    }
  }

  rebuildGame() {
    console.log('rebuildGame');
    this.isRebuilding = true;
    const {netKey} = this.state;

    // teardown
    if (this.game) {
      this.game.dispose();
    }

    // setup
    const net = (netKey === 'emojinet')
      ? new EmojiNet()
      : new MobileNet();
    this.game = new Game(net, this.videoElementEl);
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
    if (this.isRebuilding) return;

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

  onToggleNet(e) {
    e.preventDefault();

    const {thresholdToShowText} = this.state;
    const netKey = (this.state.netKey === 'emojinet')
      ? 'mobilenet'
      : 'emojinet';
    this.setState({
      ...initialState(),
      thresholdToShowText,
      netKey
    });
  }

  onGameInitialized() {
    console.log('onGameInitialized');
    this.isRebuilding = false;
    this.setState({startedTimestampMs: new Date().getTime()});
    this.scheduleNextTick();
  }

  onGameInitializationError(error) {
    const {messageText} = interpretInitializationError(error);
    this.setState({errorMessageText: messageText});
  }

  onReset(e) {
    e.preventDefault();
    this.setState({guessHistory: []});
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
    const {netKey, topK} = this.state;
    const thresholdToShow = this.thresholdToShow();
    const guesses = (topK || []).filter(k => k.value * 100 >= thresholdToShow);
    console.log('guesses', guesses);
    return (
      <div className="App-floating">
        <div className="App-floating-panel" style={{flex: 2}}>
          <div className="App-floating-title">best guess right now</div>
          <div>
            <div>{!topK && <div style={{fontSize: 36, marginTop: 20}}>loading...</div>}</div>
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
          {this.renderGuesses()}
        </div>
        <div className="App-floating-panel">
          <div className="App-floating-title">confidence level</div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Slider
              style={{width: '80%', height: 35}}
              onChange={this.onChangeThreshold}
              min={0}
              value={thresholdToShow}
              marks={{ 1: 1, 10:10, 50: 50, 85: 85, 99: 99 }}
              step={null} 
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: 10}}>
            <div>
              <a
                href="/"
                style={{color: 'black', fontWeight: 'bold'}}
                onClick={this.onToggleNet}>
                {netKey}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderGuesses() {
    const {guessHistory} = this.state;
    const guessesSoFar = uniqueGuessesSoFar(guessHistory);
    
    return (
      <div>
        <div className="App-floating-title">
          <span>guesses so far</span>
          {guessesSoFar.length > 0 ? ` (${guessesSoFar.length})` : ''}
          <a href="/?reset" style={{color: 'black', padding: 5}} onClick={this.onReset}>reset</a>
        </div>
        <div>{guessesSoFar.map(label => (
          <div key={label}>
            <span>{label}</span>
            <img src={toSvg(label)} height="16" width="16" alt="" />
          </div>
        ))}</div>
      </div>
    );
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
    netKey: readNetKeyFromWindow(),
    errorMessageText: null,
    topK: null,
    thresholdToShowText: '10',
    guessHistory: [],
    startedTimestampMs: null,
    timeOfBoomMs: null
  };
}


function readNetKeyFromWindow() {
  if (window.location.search.indexOf('emojinet') !== -1) return 'emojinet';
  if (window.location.search.indexOf('mobilenet') !== -1) return 'mobilenet';
  return 'emojinet';
}