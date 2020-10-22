import React from 'react';
import Login from './Login.js'
import SignUp from './SignUp.js'
import PrivateRoute from './PrivateRoute';
import Navbar from './Navbar'
import Home from './Home'
import Role from './Role/Role'
import FormsRole from './Role/Forms'
import User from './User/User'
import FormsUser from './User/Forms'
import Agent from './Agent/Agent'
import FormsAgent from './Agent/Forms'
import Unit from './Unit/Unit'
import FormsUnit from './Unit/Forms'
import Customer from './Customer/Customer'
import FormsCustomer from './Customer/Forms'
import Contract from './Contract/Contract'
import FormsContract from './Contract/Forms'
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
            <PrivateRoute exact path="/user" component={{ navbar: Navbar, content: User}}></PrivateRoute>
            <PrivateRoute path="/user/:type/:id?" component={{ navbar: Navbar, content: FormsUser}}></PrivateRoute>
            <PrivateRoute exact path="/agent" component={{ navbar: Navbar, content: Agent}}></PrivateRoute>
            <PrivateRoute path="/agent/:type/:id?" component={{ navbar: Navbar, content: FormsAgent}}></PrivateRoute>
            <PrivateRoute exact path="/unit" component={{ navbar: Navbar, content: Unit}}></PrivateRoute>
            <PrivateRoute path="/unit/:type/:id?" component={{ navbar: Navbar, content: FormsUnit}}></PrivateRoute>
            <PrivateRoute exact path="/customer" component={{ navbar: Navbar, content: Customer}}></PrivateRoute>
            <PrivateRoute path="/customer/:type/:id?" component={{ navbar: Navbar, content: FormsCustomer}}></PrivateRoute>
            <PrivateRoute exact path="/contract" component={{ navbar: Navbar, content: Contract}}></PrivateRoute>
            <PrivateRoute path="/contract/:type/:id?" component={{ navbar: Navbar, content: FormsContract}}></PrivateRoute>
            <Route path="/login" component={Login}></Route>
            <Route path="/signup" component={SignUp}></Route>
          </Switch>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
