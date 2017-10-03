import React, { Component } from 'react';
import { formatPrice } from '../helpers';
import CSSTransitionGroup from 'react-addons-css-transition-group';

export default class Order extends Component {
  constructor() {
    super();
    this.renderOrder = this.renderOrder.bind(this);
  }
  renderOrder(key) {
    const fish = this.props.fishes[key];
    const count = this.props.order[key];
    const removeButton = <button onClick={() => this.props.removeFromOrder(key)}>&times;</button>

    // This is essentially our loading state, gets fired if order doesn't load
    if(!fish || fish.status === 'unavailable') {
      return <li key={key}>Sorry, {fish ? fish.name : 'fish'} is no longer available</li>
    }

    return (
      <li key={key}>
        <span>
          <CSSTransitionGroup
            component="span"
            className="count"
            transitionName="count"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}
          >
            <span key={count}>{count}</span>
          </CSSTransitionGroup>
            lbs {fish.name} {removeButton}
        </span>
        <span className="price">{formatPrice(count * fish.price)}</span>
      </li>
    )
  }
  render() {
    const orderIds = Object.keys(this.props.order);
    const total = orderIds.reduce((prevTotal, key) => {
      const fish = this.props.fishes[key];
      const count = this.props.order[key];
      const isAvailable = fish && fish.status === 'available';
      // if the fish is available, return prev total AND add new stuff, otherwise just return existing amount
      if (isAvailable) {
        return prevTotal + (count * fish.price || 0);
      }
      return prevTotal;
      // 0 is the starting value for Reduce
    }, 0);
    return (
      <div className="order-wrap">
        <h2>Your Order</h2>

        {/* This was originally a ul that was replaced as a CSSTransitionGroup, see _animations.styl */}
        <CSSTransitionGroup 
          className="order"
          component="ul"
          transitionName="order"
          transitionEnterTimeout={5000}
          transitionLeaveTimeout={5000}
        >
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {formatPrice(total)}
          </li>
        </CSSTransitionGroup>
        
      </div>
    )
  }
}

Order.propTypes = {
  order: React.PropTypes.object.isRequired,
  fishes: React.PropTypes.object.isRequired,
  removeFromOrder: React.PropTypes.func.isRequired,
}