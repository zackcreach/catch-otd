import React, { Component } from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

export default class Inventory extends Component {
  // constructor() {
  //   super();
    // this.renderLogin = this.renderLogin.bind(this);
    // this.renderInventory = this.renderInventory.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    // this.logout = this.logout.bind(this);
    // this.authenticate = this.authenticate.bind(this);
    // this.authHandler = this.authHandler.bind(this);
    // this.state = {
    //   uid: null,
    //   owner: null
    // }
  // }
  state = {
    uid: null,
    owner: null,
  };
  componentDidMount() {
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, { user });
      }
    })
  }
  handleChange = (e, key) => {
    // Make a copy of one single fish that changed (with [key])
    const fish = this.props.fishes[key];

    // Make a copy of the fish and then overwrite it with what changed
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value
    }
    this.props.updateFish(key, updatedFish);
  };
  renderLogin = () => {
    const logout = <button>Log Out!</button>
    return (
      <nav className="login">
        <h2>Inventory</h2>
        {logout}
        <button className="github" onClick={() => this.authenticate('github')}>Log In With Github</button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>Log In With Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>Log In With Twitter</button>
      </nav>
    )
  };
  authenticate = (provider) => {
    console.log(`Trying to login with ${provider}`);
    base.authWithOAuthPopup(provider, this.authHandler);
  };
  logout = () => {
    base.unauth();
    this.setState({
      uid: null
    })
  };
  authHandler = (err, authData) => {
    console.log(authData);
    if (err) {
      console.log(err);
      return;
    }

    // grab the store info
    // .database() grabs the whole store, ref grabs specific data
    const storeRef = base.database().ref(this.props.storeId);

    // query the database once for the store data
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      // claim it as our own if there's no owner already
      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        })
      }

      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      })
    })
  };
  renderInventory = (key) => {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={(e) => this.handleChange(e, key)} />
        <input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={(e) => this.handleChange(e, key)} />
        <select type="text" name="status" value={fish.status} placeholder="Fish Status" onChange={(e) => this.handleChange(e, key)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc" onChange={(e) => this.handleChange(e, key)}></textarea>
        <input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={(e) => this.handleChange(e, key)} />
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  };
  render() {
    // Fun fact: you only need to do () => this.logout() if you're passing
    // arguments and you want them bound. If no arguments, no function needed!
    const logout = <button onClick={this.logout}>Log Out!</button>
    // Check if they are not logged in at all
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    // Check if they are the owner of the current store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you aren't the owner of the store!</p>
          {logout}
        </div>
      )
    }
    return (
      <div>
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish} />  
        <button onClick={this.props.loadSamples} >Load Sample Fishes</button>
      </div>    
    )
  }
  // Adding the static keyword means we don't need a copy
  // every time Inventory class is initialized
  static propTypes = {
    fishes: React.PropTypes.object.isRequired,
    updateFish: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    addFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    storeId: React.PropTypes.string.isRequired,
  };
}