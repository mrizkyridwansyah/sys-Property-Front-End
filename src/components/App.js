import React from 'react';
import Login from './Login.js'
import SignUp from './SignUp.js'
import PrivateRoute from './PrivateRoute';
import Navbar from './Navbar'
import Home from './Home'
import Role from './Role/Role'
import FormsRole from './Role/Forms'
import { AuthProvider } from '../contexts/AuthContext'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={{ navbar: Navbar, content: Home}}></PrivateRoute>
            <PrivateRoute exact path="/role" component={{ navbar: Navbar, content: Role}}></PrivateRoute>
            <PrivateRoute path="/role/:type/:id?" component={{ navbar: Navbar, content: FormsRole}}></PrivateRoute>
            <Route path="/login" component={Login}></Route>
            <Route path="/signup" component={SignUp}></Route>
          </Switch>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
