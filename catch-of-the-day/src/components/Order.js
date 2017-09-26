import React, { Component } from 'react';

export default class Order extends Component {
  render() {
    const orderIds = Object.keys(this.props.order);
    return (
      <div className="order-wrap">
        <h2></h2>
      </div>
    )
  }
}