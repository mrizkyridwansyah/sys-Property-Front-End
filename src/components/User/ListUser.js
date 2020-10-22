import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function ListUser(props) {
    const { 
        user, 
        handleDeleteUser,
        handleUpdateStatusUser
    } = props

    const history = useHistory()
    
    function handleEditUser(e){
        const id = e.target.dataset.id
        history.push(`/user/edit/${id}`)
    }
    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{user.email}
                    <Badge variant={user.is_active ? "secondary" : "success"} className="ml-2" style={{float: "right", cursor: "pointer"}} data-status={user.is_active} data-id={user.id} onClick={handleUpdateStatusUser} >{user.is_active ? "Block" : "Activate"}</Badge>
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={user.id} onClick={handleDeleteUser}>Delete</Badge>
                    <Badge variant="primary" style={{float: "right", cursor: "pointer"}} data-id={user.id} onClick={handleEditUser}>Edit</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
