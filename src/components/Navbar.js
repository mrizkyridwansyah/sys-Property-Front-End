import React, { useState, useEffect } from 'react'
import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navigation() {
    const [error, setError] = useState('')
    const [currentUserEmail, setCurrentUserEmail] = useState("")
    const [currentUserRole, setCurrentUserRole] = useState("")
    const { queryFetch, logout } = useAuth()
    const history = useHistory()

    async function handleLogOut() {
        try {
            setError("")
            const token = sessionStorage.getItem('refresh_token')
            await logout(token);
            history.push('/login')
        } catch(err){
            setError(err.message)
            alert(error)
        }
    }

    useEffect(() => {
        const user_id = sessionStorage.getItem("user_id")
        const query = `
            query {
                user(id: "${user_id}") {
                    email, 
                    role_id,
                    role {
                        name
                    }
                }
            }`
        queryFetch(query).then(async(data) => {
            if(data.errors) {
                if(data.errors[0].message === "Unauthorized") {
                    await logout(sessionStorage.getItem("refresh_token"))
                } else {
                    return setError(data.errors[0].message)
                }
            } else {
                setCurrentUserEmail(data.data.user.email)
                setCurrentUserRole(data.data.user.role.name)
            }
        })
    }, [])

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">Sys-Property</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title="Security">
                            <NavDropdown.Item href="/role">Role</NavDropdown.Item>
                            <NavDropdown.Item href="/user">User</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/page">Access Page</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Sales" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="/agent">Agent</NavDropdown.Item>
                            <NavDropdown.Item href="/unit">Unit</NavDropdown.Item>
                            <NavDropdown.Item href="/customer">Customer</NavDropdown.Item>
                            <NavDropdown.Item href="/contract">Contract</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavDropdown title={currentUserEmail + " (" + currentUserRole + ")"} id="collasible-nav-dropdown">
                            <NavDropdown.Item onClick={handleLogOut}>Log Out</NavDropdown.Item>
                        </NavDropdown>
                        {/* <Nav.Link onClick={handleLogOut}>Log Out</Nav.Link> */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
