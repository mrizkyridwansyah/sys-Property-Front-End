import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function ListCustomer(props) {
    const {
        customer, 
        handleDeleteCustomer
    } = props
    const history = useHistory()
    
    async function handleEditCustomer(e) {
        const id = e.target.dataset.id
        history.push(`/customer/edit/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{customer.name}
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={customer.id} onClick={handleDeleteCustomer}>Delete</Badge>
                    <Badge variant="primary" style={{float: "right", cursor: "pointer"}} data-id={customer.id} onClick={handleEditCustomer}>Edit</Badge>
                    <small style={{float: "right"}} className="mr-3">({customer.customer_code})</small>                 
                </ListGroup.Item>
            </ListGroup>            
        </>
    )
}
