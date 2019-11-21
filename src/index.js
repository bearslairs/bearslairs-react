import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './index.css';
import App from './App';
import Book from './Book';

const routing = (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/book" component={Book} />
    </Switch>
  </BrowserRouter>
);
ReactDOM.render(routing, document.getElementById('root'));
