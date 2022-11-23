import { useContext } from "react";
import DataContext from '../Contexts/DataContext';

function Messages() {

    const { msgs, setMsgs } = useContext(DataContext);

    const closeMsg = id => {
        setMsgs(m => m.filter(mes => mes.id !== id));
    }

    if (msgs.length === 0) {
        return null;
    }

    return (
        <div className="msg-bin">
            {
                msgs.map(m =>
                    <div key={m.id} className={'toast show ' + m.class} role="alert">
                        <div className="toast-header">
                            <strong className="me-auto">Foods</strong>
                            <button onClick={() => closeMsg(m.id)} type="button" className="btn-close"></button>
                        </div>
                        <div className="toast-body">
                            {m.text}
                        </div>
                    </div>
                )
            }
        </div>

    )
}

export default Messages;