import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid'
import './Home.css'
import Button from '@mui/material/Button'
import { Typography } from '@mui/material'
import Popup from './popup/Popup.js'
import DeleteIcon from '@mui/icons-material/Delete'
import LogoutIcon from '@mui/icons-material/Logout'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min.js'




const Home = ({ setIsAuth }) => {

    const history = useHistory()
    const [docs, setDocs] = useState([])
    const [reload, setReload] = useState(false)

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const openPopup = () => setIsPopupOpen(true)
    const closePopup = () => setIsPopupOpen(false)


    const deleteHandler = (id) => {

        const sendDeleteRequest = async (id) => {

            try {
                const { data } = await axios.delete(`/delete/${id}`)
                console.log(data)
                setReload((prev) => !prev)
            } catch (error) {
                console.log(error)
            }

        }

        sendDeleteRequest(id)

    }

    const logOutHandler = async () => {
        try {
            await axios.get('/logout')
            setIsAuth(false)
            history.push('/')
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {

        const fetchDocs = async () => {
            try {
                const { data } = await axios.get('/docs')
                setDocs(data.docs)
            } catch (error) {
                console.log(error)
            }

        }

        fetchDocs()

    }, [reload])


    const columns = [
        {
            field: 'id', headerName: 'No', width: 70, sortable: false,
            renderCell: (params) => (
                <p>{params.row.id}.</p>
            )
        },
        {
            field: 'name', headerName: 'NAME', width: 550, sortable: false,
            renderCell: (params) => (
                <a target='_blank' rel='noreferrer' href={`/doc/${params.row.key}/${params.row.name}`}>{params.row.name}</a>
            )
        },
        { field: 'key', headerName: 'KEY', width: 0 },
        {
            field: 'action', headerName: '', width: 70, sortable: false,
            renderCell: (params) => (
                <Button>
                    <DeleteIcon onClick={() => { deleteHandler(params.row.key) }} />
                </Button>
            )
        }
    ]

    const rows = []


    if (docs.length) {
        docs.forEach((doc, index) => {
            rows.push({ id: index + 1, name: doc?.name, key: doc._id })
        })
    }



    return (
        <div className='container'>
            <div className='btn-container'>
                <Button className='logout-btn' variant="contained" onClick={logOutHandler}><LogoutIcon /></Button>
            </div>
            <div className='top'>
                <div className='title'>
                    <Typography variant='poster'><h1>Hey Sagar!!!</h1></Typography>

                </div>
                <div className='create-btn-box'>
                    <Button className='btn' variant="outlined" onClick={openPopup}>CREATE NEW</Button>
                    {isPopupOpen && <Popup onClose={closePopup} />}

                    {isPopupOpen && <Popup onClose={closePopup} />}
                </div>
            </div>

            <div className='table'>
                <div className='data-table'>
                    <DataGrid
                        rows={rows}
                        disableSelectionOnClick
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                            columns: {
                                columnVisibilityModel: {
                                    key: false,
                                }
                            }
                        }}

                    />
                </div>
            </div>
        </div>
    )
}

export default Home
