import React, { Component } from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

export default class App extends Component {
  // No longer need constructor, see notes below
  // constructor() {
    // super();

    // No longer need to bind in the constructor! Refactored all custom methods to arrow functions
    // Thanks ES6!

    // this.addFish = this.addFish.bind(this);
    // this.updateFish = this.updateFish.bind(this);
    // this.removeFish = this.removeFish.bind(this);
    // this.loadSamples = this.loadSamples.bind(this);
    // this.addToOrder = this.addToOrder.bind(this);
    // this.removeFromOrder = this.removeFromOrder.bind(this);

    // You can also define state in the constructor, or just declare state below
    // this.state = {
    //   fishes: {},
    //   order: {}
    // }
  // }
  // just like adding properties to an object
  // if we don't add static up front, it creates a new copy
  // of state each time the App class is initialized, see proptypes in Inventory
  // for when to use static
  state = {
    fishes: {},
    order: {}
  }
  componentWillMount() {
    // WillMount will run right before our component renders
    // Let's connect up base.js (firebase config) to our component with WillMount
    // React router (being the parent component) gave us the params.storeId which we can use here
    // We're adding base.syncState as a ref to use in unmount
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`,
    {
      context: this,
      state: 'fishes'
    });

    // Check if there's any items in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if (localStorageRef) {
      // Update our app component's order state
      this.setState({
        order: JSON.parse(localStorageRef)
      })
    }
  }
  componentWillUnmount() {
    // Remove the firebase ref once we leave/unmount the component
    base.removeBinding(this.ref);
  }
  componentWillUpdate(nextProps, nextState) {
    // Lifecycle method that runs immediately before rendering for if props or state change
    // JSON Stringify is needed because localStorage ONLY stores strings
    localStorage.setItem(`order-${this.props.params.storeId}`,
      JSON.stringify(nextState.order));
  }
  addFish = (fish) => {
    const fishes = {...this.state.fishes}
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    this.setState({
      fishes
    })
  };
  updateFish = (key, updatedFish) => {
    const fishes = {...this.state.fishes}
    fishes[key] = updatedFish;
    this.setState({
      fishes
    })
  };
  removeFish = (key) => {
    const fishes = {...this.state.fishes}
    // Could simply use the delete keyword, but firebase doesn't like that
    // delete fishes[key]
    fishes[key] = null;
    this.setState({
      fishes
    });
  };
  loadSamples = () => {
    this.setState({
      fishes: sampleFishes 
    })
  };
  addToOrder = (key) => {
    // Make a copy of our state
    const order = {...this.state.order};
    // Update OR add a new number of fish
    order[key] = order[key] + 1 || 1;
    // Update our state now
    this.setState({
      order
    })
  };
  removeFromOrder = (key) => {
    const order = {...this.state.order}
    delete order[key];
    this.setState({
      order
    })
  };
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
        {/* Adding in params to be used to access order for localstorage (within componentWillUpdate) */}
        <Order 
          fishes={this.state.fishes} 
          order={this.state.order} 
          params={this.props.params}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory 
          addFish={this.addFish} 
          loadSamples={this.loadSamples} 
          fishes={this.state.fishes}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          storeId={this.props.params.storeId}
        />
      </div>
    )
  }
  static propTypes = {
    params: React.PropTypes.object.isRequired
  };
}
