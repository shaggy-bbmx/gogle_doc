import React from 'react'
import './Login.css'
import LoginForm from './Forms/LoginForm.js'
import RegisterForm from './Forms/RegisterForm.js'
import { useState } from 'react'



const Login = ({ setIsAuth }) => {

    const [activeTab, setActiveTab] = useState('login')


    const handleTabClick = (tab) => {
        setActiveTab(tab)

    }

    return (
        <div className='login-page'>
            <div className="switcher-container">
                <div className="switcher-tab">
                    <button
                        className={activeTab === 'login' ? 'active' : ''}
                        onClick={() => handleTabClick('login')}
                    >
                        Login
                    </button>
                    <button
                        className={activeTab === 'register' ? 'active' : ''}
                        onClick={() => handleTabClick('register')}
                    >
                        Register
                    </button>
                </div>

                {activeTab === 'login' && <LoginForm setIsAuth={setIsAuth} />}
                {activeTab === 'register' && <RegisterForm setIsAuth={setIsAuth} />}

            </div>
        </div>
    )
}

export default Login
