import React from 'react';
import { Button } from 'react-bootstrap'
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

const uri = 'http://localhost:8080'

const add = () => {
  console.log('clicked')

  axios.get(uri + '/addFruit')
  .then(data => console.log(data))
}

const view = () => {
  console.log('clicked')

  axios.get(uri + '/viewFruit')
  .then(data => console.log(data))
}

function App() {


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button onClick={add}>add</Button>
        <Button onClick={view}>view</Button>

      </header>
    </div>
  );
}

export default App;
