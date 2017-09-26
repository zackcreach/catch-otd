import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Match, Miss } from 'react-router';
import './css/style.css';

import App from './components/App';
import StorePicker from './components/StorePicker';
import NotFound from './components/NotFound';

const Route = () => {
  return (
    <Router>
      <div>
        <Match exactly pattern="/" component={StorePicker} />
        <Match pattern="/store/:storeId" component={App} />
        <Miss component={NotFound} />
      </div>
    </Router>
  )
}

render(
  <Route />,
  document.getElementById('main')
);