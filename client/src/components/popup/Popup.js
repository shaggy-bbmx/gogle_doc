import React from 'react'
import './Popup.css'
import { v4 as uuidv4 } from 'uuid'
import { useState } from 'react'





const Popup = ({ onClose }) => {

    const [name, setName] = useState('')
  

    const submitHandler = (e, onClose) => {
        e.preventDefault()
        window.open(`/doc/${uuidv4()}/${e.target.name.value}`, '_blank', 'noreferrer')
        setName('')
        onClose()
    }


    return (
        <div className="popup-container"
            onClick={(e) => {
                if (e.target.className === 'popup-container') onClose()
            }}
            name='popup-page'>

            <div className="popup" name='popup-box'>

                <span className='cancel-btn' onClick={() => { onClose() }}>×</span>

                <form onSubmit={(e) => { submitHandler(e, onClose) }} className='form-body'>
                    <label className='label'>Name:</label>
                    <input value={name} autoFocus='autoFocus' onChange={(e) => setName(e.target.value)} name='name'
                        className='input-field' />
                    <button type='submit' className='submit-button'>OK</button>
                </form>


            </div>
        </div>
    )
}

export default Popup
