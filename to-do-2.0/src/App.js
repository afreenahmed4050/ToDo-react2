import { Button, TextField } from '@material-ui/core'
import React, { useState, useEffect} from 'react'
import firebase from "firebase"
import {db} from './firebase_config'
import TodoListItem from "./Todo";


export default function App() {

    const [todos, setTodos] = useState([]);
    const [todoInput, setTodoInput]= useState('');

    useEffect(() => {
        getTodos();
    }, [])

    function handleChange(e){
        setTodoInput(e.target.value);   
    }

    function getTodos(){
        db.collection('todos').orderBy('timestamp', 'desc').onSnapshot(function (querySnapshot) {
            setTodos(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    todo: doc.data().todo,
                    progress: doc.data().progress
                }))
            );
        })
    }

    function addTodo(e){
        e.preventDefault();
        
        db.collection('todos').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            todo: todoInput,
            progress: true
        });

        setTodoInput('');
    }

    return (
        <div className="app">
        <form>
            <h1>Afreen's ToDo App 🔥</h1>
            <TextField value={todoInput} onChange={handleChange} id="standard-basic" label="Enter To Do" />
            <Button className="button" onClick={addTodo} type="submit" variant="contained">Default</Button>
        </form>

        {todos.map((todo) => (
            <TodoListItem todo={todo.todo} progress={todo.progress} id={todo.id} />
        ))}
        </div>
    )
}
