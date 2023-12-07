import React, { useEffect, useState } from "react"
import TextEditor from "./TextEditor"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Redirect } from "react-router-dom/cjs/react-router-dom.min"
import { v4 as uuidv4 } from 'uuid'
import Home from './components/Home.js'
import Login from './Login/Login.js'
import axios from "axios"



function App() {

  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {

  }, [])


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/isAuth')
        console.log(data)
        if (data.auth) {
          setIsAuth(true)
        } else {
          setIsAuth(false)
        }
      } catch (error) {
        setIsAuth(false)
        console.log(error)
      }
    }

    checkAuth()

  }, [])


  return (
    <Router>
      <Switch>
        <Route exact path='/'>{!isAuth ? <Login setIsAuth={setIsAuth} /> : <Redirect to='/home' />}</Route>
        <Route exact path='/home'>{isAuth ? <Home setIsAuth={setIsAuth} /> : <Redirect to='/' />}</Route >
        <Route exact path='/create'>
          <Redirect to={`/doc/${uuidv4()}/:name`} />
        </Route>
        <Route exact path='/doc/:id/:name'>
          {isAuth && <TextEditor />}
        </Route>
      </Switch>
    </Router>

  )
}

export default App 
