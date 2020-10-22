import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export default function PrivateRoute({ component: Component, ...rest}) {
    return (
        <Route
        {...rest}
            render={props => {
                    return sessionStorage.getItem('refresh_token') !== null ? 
                    <>
                        <Component.navbar {...props} />
                        <Component.content {...props} /> 
                    </>
                    : <Redirect to="/login" />
                }
            }
        >
        </Route>
    )
}
