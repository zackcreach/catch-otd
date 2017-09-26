import React, { Component } from 'react';
import { formatPrice } from '../helpers';

export default class Fish extends Component {
  render() {
    const { index, details: {image, name, price, status, desc}} = this.props;
    // Quick way to check true/false whilst defining a variable
    const isAvailable = status === 'available';
    // Now we can use a tenary within the next variable
    const buttonText = isAvailable ? 'Add To Order' : 'Sold Out!';

    return (
      <li className='menu-fish'>
        <img src={image} alt={name} />
        <h3 className="fish-name">
          {name}
          <span className="price">{formatPrice(price)}</span>
        </h3>
        <p>{desc}</p>
        {/* We need to make onClick an arrow function in order to pass arguments */}
        <button onClick={() => this.props.addToOrder(index)} disabled={!isAvailable}>{buttonText}</button>
      </li>
    )
  }
}