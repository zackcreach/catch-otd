import React, { Component } from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';

export default class App extends Component {
  constructor() {
    super();

    this.addFish = this.addFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.state = {
      fishes: {},
      order: {}
    }
  }
  addFish(fish) {
    const fishes = {...this.state.fishes}
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    this.setState({
      fishes
    })
  }
  loadSamples() {
    this.setState({
      fishes: sampleFishes 
    })
  }
  addToOrder(key) {
    // Make a copy of our state
    const order = {...this.state.order};
    // Update OR add a new number of fish
    order[key] = order[key] + 1 || 1;
    // Update our state now
    this.setState({
      order
    })
  }
  render() {
    return (
      <div className='catch-of-the-day'>
        <div className='menu'>
          <Header tagline="Zack is Cool."/>
          <ul className="list-of-fishes">
            {/* this.state.fishes can't be immediately mapped as it's not an array but an object */}
            {/* Object.keys converts our object into an array of just the property names */}
            {/* The index prop is made up in order to pass down the key (which only React uses), as we can't access the key prop */}
            {
              Object
                .keys(this.state.fishes)
                .map(eachFish => <Fish 
                  key={eachFish} 
                  index={eachFish}
                  details={this.state.fishes[eachFish]}
                  addToOrder={this.addToOrder}  
                />)
            }
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
      </div>
    )
  }
}