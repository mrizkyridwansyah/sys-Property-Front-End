import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function ListRole(props) {
    const { 
        role, 
        handleDeleteRole
    } = props

    const history = useHistory()
    
    function handleEditRole(e){
        const id = e.target.dataset.id
        history.push(`/role/edit/${id}`)
    }
    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{role.name}
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={role.id} onClick={handleDeleteRole}>Delete</Badge>
                    <Badge variant="primary" style={{float: "right", cursor: "pointer"}} data-id={role.id} onClick={handleEditRole}>Edit</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
