import React, { useState } from 'react'
import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navigation() {
    const { logout } = useAuth()
    const [error, setError] = useState('')
    const history = useHistory()

    async function handleLogOut() {
        try {
            setError("")
            const token = sessionStorage.getItem('refresh_token')
            console.log(token)
            await logout(token);
            history.push('/login')
        } catch(err){
            setError(err.message)
        }
    }
console.log(error)
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">Sys-Property</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    <NavDropdown title="Security">
                        <NavDropdown.Item href="/role">Role</NavDropdown.Item>
                        <NavDropdown.Item href="/agent">User</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/page">Access Page</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Setup Sales">
                        <NavDropdown.Item href="/agent">Agent</NavDropdown.Item>
                        <NavDropdown.Item href="/unit">Unit</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Sales" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="/customer">Customer</NavDropdown.Item>
                        <NavDropdown.Item href="/contract">Contract</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={handleLogOut}>Log Out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
