import React, { useState } from 'react'
import './RegisterForm.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios'


const RegisterForm = ({ setIsAuth }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const history = useHistory()




  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) return

    const registerUser = async (email, password) => {
      try {
        const { data } = await axios.post('/register', { email, password })
        console.log(data.token)
        setIsAuth(true)
        history.push('/home')
      } catch (error) {
        history.push('/')
      }
    }

    registerUser(email, password)

  }



  return (
    <div className='login-container'>
      <form onSubmit={submitHandler}>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required autoFocus='autofocus'
            onChange={(e) => { setEmail(e.target.value) }} />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required
            onChange={((e) => { setPassword(e.target.value) })}
          />
        </div>

        <div class="form-group">
          <label for="password">Confirm Password:</label>
          <input type="password" id="password" name="confirmPassword" required
            onChange={(e) => { setConfirmPassword(e.target.value) }}
          />
        </div>

        <button type="submit" class="submit-button">Register</button>
      </form>
    </div>
  )
}

export default RegisterForm
