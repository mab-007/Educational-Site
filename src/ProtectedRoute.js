import React from 'react';
import {Route, Redirect} from "react-router-dom";
import { AuthContext } from './App';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const ProtectedRoute = ({Component,...rest})=>{
    const authData = React.useContext(AuthContext)
    console.log(authData ,  "-------PROTECTED ROUTE-------")
    return (
        authData.isLoading?<Spin indicator={antIcon} style={{fontSize:"32px",width:"32px",height:"32px", margin:"50vh 50vw"}} />:
        authData.accessToken?(<Route {...rest} 
            render = {props => {
                return <Component {...props}/>
            }}
        />)
        :<Redirect to="/signin"/>
    )
}

export default ProtectedRoute