import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      displayError: false
    }
    this.incrementCounter = this.incrementCounter.bind(this);
    this.decrementCounter = this.decrementCounter.bind(this);
  }

  incrementCounter() {
    if (this.state.displayError) {
      this.setState({ displayError: false});
    }
    this.setState({counter: this.state.counter + 1})
  }

  decrementCounter() {
    if (this.state.counter === 0) {
      this.setState({ displayError: true});
    } else {
      this.setState({counter: this.state.counter - 1});
    }
  }

  render() {

      return (
        <div data-test="component-app">
          <h1 data-test="counter-display">The counter is currently {this.state.counter}</h1>
          <button 
            onClick={this.incrementCounter}
            data-test="increment-button">
            Increment counter
          </button>
          <button 
            onClick={this.decrementCounter}
            data-test="decrement-button">
            Decrement counter
          </button>
          { this.state.displayError ? <p data-test="error-message">The counter cannot go below 0</p> : ''}
        </div>);
  }

}

export default App;
