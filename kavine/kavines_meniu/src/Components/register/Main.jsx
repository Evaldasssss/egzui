import { useState, useEffect } from 'react';
import Register from '../../Contexts/Register';
import Create from './Create';
import axios from 'axios';
import { authConfig, login } from '../../Functions/auth';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import DataContext from '../../Contexts/DataContext';


function Main({setRoleChange}) {

    const navigate = useNavigate()
    const [createUser, setCreateUser] = useState(null);
    const { makeMsg } = useContext(DataContext);

    useEffect(() => {
        if (null === createUser) {
            return;
        }
        axios.post('http://localhost:3003/register', createUser, authConfig())
            .then(res => {
                setRoleChange(Date.now());
                login(res.data.key);
                navigate('/', { replace: true });
                makeMsg(res.data.text, res.data.type);
            });
    }, [createUser, navigate, setRoleChange, makeMsg]);

    return (
        <Register.Provider value={{
            setCreateUser
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col col-lg-4 col-md-12">
                        <Create />
                    </div>
                </div>
            </div>
        </Register.Provider>
    )
}
export default Main;