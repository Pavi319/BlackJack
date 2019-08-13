import React, { Component } from 'react';

import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './containers/Router/Router'
import Layout from './components/Layout/Layout'
class App extends Component {
  
  render() {
    return (
        <BrowserRouter>
      <div>
        <Layout>
          <Router/>
        </Layout>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;