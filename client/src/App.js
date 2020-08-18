import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AppBar from './components/AppBar'
import TextField from '@material-ui/core/TextField'
import './App.css'
import axios from 'axios'

// import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
// import purple from '@material-ui/core/colors/purple'
// import green from '@material-ui/core/colors/green'
import blue from '@material-ui/core/colors/blue'
import grey from '@material-ui/core/colors/grey'




  const toggleDrawer = (drawer,setDrawer) => {
    if(drawer){
      setDrawer(false)
    } else {
      setDrawer(true)
    }
  };


const uri = 'http://localhost:8080'

// const add = () => {
//   console.log('clicked')

//   axios.get(uri + '/addFruit')
//   .then(data => console.log(data))
// }

// const save = () => {
//   console.log('clicked')

//   axios.get(uri + '/saveFruit')
//   .then(data => console.log(data))
// }

// const view = () => {
//   console.log('clicked')

//   axios.get(uri + '/viewFruit')
//   .then(data => console.log(data.data))
// }

// const deleteDuplicates = () => {
//   console.log('clicked')

//   axios.get(uri + '/deleteDuplicates')
//   .then(data => console.log(data))
// }

// const nytJSON = () => {
//   console.log('clicked')

//   axios.get(uri + '/nytJSON')
//   .then(data => console.log(data.data))
// }

const getWord = () => {
  console.log('clicked')

  axios.get(uri + '/getWord')
  .then(data => console.log(data.data.results[0].id))
}

const doThesaurus = (outputValue,setOutputValue) => {

  let jsony = { data: outputValue }

  axios.post(uri + '/doThesaurus', jsony)
  .then(data => setOutputValue(data.data.results))
}



const submitUri = uri + "/transpose"

const transpose = (outputValue,setOutputValue) => {

  let jsony = { data: outputValue }
  axios.post(submitUri, jsony)
  .then(response=>{ setOutputValue(response.data.converted) })

}

const autocorrectUri = uri + "/autocorrect"

const autocorrect = (textValue) => {

  let jsony = { data: textValue }
  axios.post(autocorrectUri, jsony)
  .then(response=>console.log(response.data.autocorrected))
}

let timer = null

function App() {

  const [ drawer, setDrawer ] = useState(false)
  const [ outputValue, setOutputValue ] = useState('')
  const [ loaded, setLoaded ] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        }
      },

      list: {
        width: 250,
      },
      fullList: {
        width: 'auto',
      },
    
  }))
  


  const barTheme = createMuiTheme({
    palette: {
      primary: {
        main: blue[500],
      },
      secondary: {
        main: blue[300],
      },
    },
  })

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: blue[600],
      },
      secondary: {
        main: grey[300],
      },
    },
  })
  
  const classes = useStyles();


///////////


  const runTimer = (text,setOutputValue) => {
    
    let currText = text.target.value
    clearTimeout(timer)
    
    timer = setTimeout(()=>{
        
        setOutputValue(currText)}, 500);
  }


  if(!loaded){


    setLoaded(true)
  }

  useEffect(()=>{

  })

  return (
    <div className="App">
      <MuiThemeProvider theme={barTheme}>
        <AppBar span="1" color="primary"/>
      </MuiThemeProvider>
      <MuiThemeProvider theme={theme}>
   
        <header className="App-header">
        

          <table width="100%">
            <colgroup>
              <col span="1" style={{width: "20%"}}></col>
           
              <col span="1" style={{width: "50%"}}></col>
              <col span="1" style={{width: "20%"}}></col>
              
      
            </colgroup>
            <tbody>
              <tr style={{display: "flex"}}>
          
                <td className={classes.root} style={{display: "flex", flexDirection: "column"}}>  
            
                  <Button variant="contained" color="primary" onClick={()=>{

                  transpose(outputValue,setOutputValue)
                  }}>Transpoke</Button>
                  <Button variant="contained" color="secondary" onClick={getWord}>Get Word</Button>
                  <Button variant="contained" color="secondary" onClick={()=>{

                  doThesaurus(outputValue,setOutputValue)
                  }}>Do Thesaurus</Button>
                  <Button variant="contained" color="secondary" onClick={()=>{  

                  autocorrect(outputValue)
                  }}>Autocorrect</Button>
                
                </td>
    
                <td className={classes.root} style={{display: "flex", flexDirection: "column"}}>
            
                  <TextField multiline={true} className="Text-feedback" alt="logo" id="filled-basic" label="Output" variant="outlined" value={outputValue} height="800px" /> 
                  
                  <TextField className="Text-input" label="input" id="text-area-test" onKeyUp={(input)=>{
                    runTimer(input,setOutputValue) }} />
                    
                </td>
      
              </tr>
            </tbody>
          </table>
        </header>
      </MuiThemeProvider>
    </div>

  );
}

export default App;

/*
                <td className={classes.root}>
                  <Button variant="contained" color="secondary" onClick={add}>add records</Button>
                  <Button variant="contained" color="secondary" onClick={save}>save records</Button>
                  <Button variant="contained" color="secondary" onClick={view}>view records</Button>
                  <Button variant="contained" color="secondary" onClick={deleteDuplicates}>delete duplicates</Button>
                  <Button variant="contained" color="secondary" onClick={nytJSON}>NYT Movie Reviews JSON</Button>
                </td>
        
*/
