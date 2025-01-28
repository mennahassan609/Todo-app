import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Users from './Users'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'
import SignUp from './Signup'
import Login from './login'
import TodoList from './TodoList'
import AddTodo from './AddTodo';
import EditTodo from './EditTodo'
import PrivateRoute from './PrivateRoute'
import Logout from './Logout'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<SignUp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path='/users' element={<Users />} />
          <Route path='/create' element={<CreateUser />} />
          <Route path="/update/:id" element={<UpdateUser />} />
      <Route
          path="/todo"
          element={
            <PrivateRoute>
              <TodoList />
            </PrivateRoute>
          }
        />
       <Route
          path="/add-todo"
          element={
            <PrivateRoute>
              <AddTodo />
            </PrivateRoute>
          }
        />
      <Route path="/edit/:id" element={<PrivateRoute><EditTodo/> </PrivateRoute>} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App
