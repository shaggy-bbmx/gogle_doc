import React, { useState } from 'react'
import { useCallback, useEffect } from 'react'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'




const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]




const TextEditor = () => {

    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()
    const { id: documentId, name } = useParams()

    useEffect(() => {
        // const s = io('http://localhost:5000')
        const s = io('https://gogle-doc-vbr0.onrender.com')
        setSocket(s)

        return () => {
            s.disconnect()
        }

    }, [])

    const wrapperef = useCallback((wrapper) => {
        wrapper.innerHTML = ''
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {
            theme: 'snow',
            modules: { toolbar: TOOLBAR_OPTIONS }
        })
        q.disable()
        q.setText('Loading....')
        setQuill(q)
    }, [])


    useEffect(() => {
        if (socket == null || quill == null) return

        socket.once('load-document', document => {
            quill.setContents(document)
            quill.enable()
        })
        socket.emit('get-document', { documentId, name })
    }, [socket, quill, documentId, name])



    useEffect(() => {
        if (socket == null || quill == null) return
        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return
            socket.emit('send-changes', delta)
        }

        quill.on('text-change', handler)
        return () => {
            quill.off('text-change', handler)
        }
    }, [socket, quill])



    useEffect(() => {
        if (socket == null || quill == null) return

        const handler = (delta) => {
            quill.updateContents(delta)
        }

        socket.on('recieve-changes', handler)

        return () => {
            socket.off('recieve-changes', handler)
        }

    }, [socket, quill])


    useEffect(() => {
        if (socket == null || quill == null) return
        const interval = setInterval(() => {
            socket.emit('save-document', quill.getContents())
        }, 2000)

        return (() => {
            clearInterval(interval)
        })

    }, [socket, quill])






    return (
        <div id='container' ref={wrapperef}>

        </div>
    )
}

export default TextEditor
