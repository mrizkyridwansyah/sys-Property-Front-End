import React from 'react'
import { ListGroup, Badge} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function ListContract(props) {
    const {
        contract,
        handleDeleteContract,
        handleCancelContract
    } = props
    const history = useHistory()
    async function handleEditContract(e) {
        e.preventDefault()
        const id = e.target.dataset.id
        let link = contract.is_active ? "edit" : "detail"
        history.push(`/contract/${link}/${id}`)        
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{contract.contract_number}
                    {
                        contract.is_active &&                     
                        <Badge variant="warning" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={contract.id} onClick={handleCancelContract} >Cancel</Badge>
                    }
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={contract.id} onClick={handleDeleteContract}>Delete</Badge>
                    <Badge variant="primary" style={{float: "right", cursor: "pointer"}} data-id={contract.id} onClick={handleEditContract}>{contract.is_active ? "Edit" : "Detail"}</Badge>
                    <small style={{float: "right"}} className="mr-3">({contract.contract_date})</small>                 
                </ListGroup.Item>
            </ListGroup>                        
        </>
    )
}
