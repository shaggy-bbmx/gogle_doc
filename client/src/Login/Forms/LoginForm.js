import React, { useState } from 'react'
import './LoginForm.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios'


const LoginForm = ({ setIsAuth }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()

  const submitHandler = (e) => {
    e.preventDefault()
    const loginUser = async (email, password) => {
      try {
        const { data } = await axios.post('/login', { email, password })
        console.log(data)
        setIsAuth(true)
        history.push('/home')
      } catch (error) {
        history.push('/')
      }
    }

    loginUser(email, password)
  }




  return (
    <div className='login-container'>
      <form onSubmit={submitHandler}>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" autoFocus='autofocus'
            onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required
            onChange={(e) => { setPassword(e.target.value) }} />
        </div>

        <button type="submit" class="submit-button">Login</button>
      </form>
    </div>
  )
}

export default LoginForm
