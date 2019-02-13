import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import {Game} from './Game';
import {toSvg} from './svgEmoji'
import Slider from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';

function uniqueGuessesSoFar(guessHistory) {
  return guessHistory ? _.uniq(guessHistory.map(k => k.label)).sort() : [];
}


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topK: null,
      thresholdToShowText: '90',
      guessHistory: [],
      startedTimestampMs: null,
      timeOfBoomMs: null
    };

    this.scheduleNextTick = this.scheduleNextTick.bind(this);
    this.onGameInitialized = this.onGameInitialized.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onChangeThreshold = this.onChangeThreshold.bind(this);
  }

  componentDidMount() {
    if (!this.videoElementEl) return;
    
    this.game = new Game(this.videoElementEl);
    this.game.init().then(this.onGameInitialized);
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

  onReset() {
    this.setState({
      topK: null,
      thresholdToShowText: '90',
      guessHistory: [],
      startedTimestampMs: null,
      timeOfBoomMs: null
    });
  }

  onChangeThreshold(thresholdToShowText) {
    this.setState({thresholdToShowText});
  }

  render() {
    const {topK} = this.state;
    const thresholdToShow = this.thresholdToShow();
    return (
      <div className="App">
        <header className="App-floating">
          <div className="App-floating-panel" style={{flex: 2}}>
            <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
              <img src={toSvg("dog")} height="64" width="64" alt="dog" />
              <button style={{fontSize: 24, background: '#ccc', border: '1px solid #999', padding: 5, height: '2em'}}onClick={this.onReset}>reset</button>
            </div>
            <p className="App-floating-title">guesses >= {thresholdToShow}%</p>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Slider
                style={{width: '80%', height: '2em'}}
                onChange={this.onChangeThreshold}
                min={0}
                value={thresholdToShow}
                marks={{ 10: 10, 50: 50, 90: 90, 99: 99 }}
                step={null} 
              />
            </div>
            <div>{!topK && 'loading...'}</div>
            <div>
              {topK && topK.filter(k => k.value * 100 >= thresholdToShow).map((k, index) => (
                <div key={k.label} style={{display: 'flex', fontWeight: index === 0 ? 'bold' : 'normal'}}>
                  <div style={{display: 'inline-block', padding: 5, width: '2em'}}>{Math.round(k.value * 100)}%</div>
                  <div style={{display: 'inline-block', padding: 5, flex: 1}}>{k.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="App-floating-panel" style={{flex: 3}}>
            <p className="App-floating-title">guesses so far</p>
            <div>{this.renderGuesses()}</div>
          </div>
        </header>
        <video
          className="App-video"
          ref={el => this.videoElementEl = el} 
          autoPlay
          playsInline
        />
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
          <div key={label}>{label} <img src={toSvg(label)} height="32" width="32" alt="" /></div>
        ))}</div>
      );
    }

    return `boom! more than ${guessesThreshold}`;
    // return `boom! more than ${guessesThreshold} in ${Math.round((timeOfBoomMs - startedTimestampMs) / 1000)} seconds`;
  }
}
App.defaultProps = {
  refreshIntervalMs: 100,
  guessesThreshold: 10
};
