import React, { Component } from 'react';

import { getFunName } from '../helpers';

export default class StorePicker extends Component {
  // constructor() {
  //   super();

  //   You can either bind this in constructor or inline below, this is faster and more "global"
  //   this.goToStore = this.goToStore.bind(this);
  // }
  goToStore(event) {
    event.preventDefault();
    const storeId = this.storeInput.value;
    // Pulling this from global contextTypes below
    this.context.router.transitionTo(`/store/${storeId}`)
  }
  render() {
    return (
      <form className='store-selector' onSubmit={this.goToStore.bind(this)}>
        <h2>Please Enter A Store</h2>
        <input 
          type='text' 
          required placeholder='Store Name' 
          defaultValue={getFunName()} 
          ref={(input) => { this.storeInput = input }} />
        <button type='submit'>Visit Store →</button>
      </form>
    )
  }
}

// Context types lets you reference objects globally
StorePicker.contextTypes = {
  router: React.PropTypes.object
}