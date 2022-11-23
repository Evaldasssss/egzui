import './App.scss';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Nav from './Components/Nav';
import Home from './Components/home/Main';
import MainFoods from './Components/foods/Main';
import RegisterPage from './Components/register/Main';
import { login, logout, authConfig } from './Functions/auth';
import { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import DataContext from './Contexts/DataContext';
import Messages from './Components/Messages';


function App() {

  const [roleChange, setRoleChange] = useState(Date.now());
  const [msgs, setMsgs] = useState([]);


  const makeMsg = useCallback((text, type = '') => {
    let msgTypeClass;
    switch (type) {
      case 'success': msgTypeClass = 'ok';
        break;
      case 'error': msgTypeClass = 'error';
        break;
      case 'info': msgTypeClass = 'info';
        break;
      default: msgTypeClass = 'default';
    }
    const msg = {
      id: uuidv4(),
      text,
      class: msgTypeClass
    }
    setMsgs(m => [...m, msg]);
    setTimeout(() => {
      setMsgs(m => m.filter(mes => mes.id !== msg.id));
    }, 6000);
  }, []);

  return (
    <DataContext.Provider value={{
      msgs,
      setMsgs,
      makeMsg
    }}>
      <BrowserRouter>
        <ShowNav roleChange={roleChange} />
        <Messages />
        <Routes>
          <Route path="/" element={<RequireAuth role="user"><Home /></RequireAuth>}></Route>
          <Route path="/login" element={<LoginPage setRoleChange={setRoleChange} />} />
          <Route path="/logout" element={<LogoutPage setRoleChange={setRoleChange} />} />
          <Route path="/foods" element={<RequireAuth role="admin"><MainFoods /></RequireAuth>}></Route>
          <Route path="/register" element={<RegisterPage setRoleChange={setRoleChange} />} />
        </Routes>
      </BrowserRouter>
    </DataContext.Provider>
  );
}


function ShowNav({ roleChange }) {
  const [status, setStatus] = useState(1);
  useEffect(() => {
    axios.get('http://localhost:3003/login-check?role=admin', authConfig())
      .then(res => {
        setStatus(res.data.status);
      })
  }, [roleChange]);
  return <Nav status={status} />
}

function RequireAuth({ children, role }) {
  const [view, setView] = useState(<h2>Please wait...</h2>);

  useEffect(() => {
    axios.get('http://localhost:3003/login-check?role=' + role, authConfig())
      .then(res => {
        if ('ok' === res.data.msg) {
          setView(children);
        }
        else if (res.data.status === 2) {
          setView(<h2>Unauthorized...</h2>)
        }
        else {
          setView(<Navigate to="/login" replace />);
        }
      })

  }, [children, role]);

  return view;
}


function LoginPage({ setRoleChange }) {
  const navigate = useNavigate();
  const { makeMsg } = useContext(DataContext);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const doLogin = () => {
    axios.post('http://localhost:3003/login', { user, pass })
      .then(res => {
        setRoleChange(Date.now());
        if ('ok' === res.data.msg) {
          login(res.data.key);
          navigate('/', { replace: true });
          makeMsg(res.data.text, res.data.type);
        }
      })
      .catch(() => {
        makeMsg('You are not from here.', 'error');
      })
  }
  return (


    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-lg-4 col-md-12">
          <div className="card m-4">
            <h5 className="card-header">Login</h5>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">name</label>
                <input type="text" className="form-control" value={user} onChange={e => setUser(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">password</label>
                <input type="password" className="form-control" value={pass} onChange={e => setPass(e.target.value)} />
              </div>
              <button onClick={doLogin} type="button" className="btn btn-outline-success">Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

function LogoutPage({ setRoleChange }) {
  const { makeMsg } = useContext(DataContext);
  useEffect(() => {
    logout();
    setRoleChange(Date.now());
    makeMsg('Goodbye.', 'info');
  }, [setRoleChange, makeMsg]);

  return (
    <Navigate to="/login" replace />
  )
}

export default App;
