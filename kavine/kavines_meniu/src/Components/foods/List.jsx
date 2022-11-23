import { useContext } from 'react';
import Foods from "../../Contexts/Foods";
import Line from './Line';

function List() {

    const { foods } = useContext(Foods);

    return (
        <div className="card m-4">
            <h5 className="card-header">Foods List</h5>
            <div className="card-body">
                <ul className="list-group">
                    {
                        foods?.map(f => <Line key={f.id} food={f} />)
                    }
                </ul>
            </div>
        </div>
    );
}

export default List;