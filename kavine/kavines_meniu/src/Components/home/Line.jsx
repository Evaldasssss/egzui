import { useContext } from 'react';
import Home from '../../Contexts/Home';

import { useState } from "react";

function Line({ food }) {

    const { setRateData } = useContext(Home);

    const [rate, setRate] = useState(5);

    const doRating = () => {
        setRateData({
            id: food[1][0].id,
            rate
        });
        setRate(5);
    }

    return (
        <li className="list-group-item">
            <div className="home">
                <div className="home__content">

                    <div className="home__content__info">
                        <h2>{food[0]}</h2>
                        {food[1][0].image ? <div className='img-bin'>
                            <img src={food[1][0].image} alt={food[0]}>
                            </img>
                        </div> : null}
                    </div>

                    <div className="home__content__price">
                        {food[1][0].price} Eur
                    </div>

                    <div className="home__content__info">
                        <h2>{food[1][0].rating ?? 'no rating'}</h2>
                        <select value={rate} onChange={e => setRate(e.target.value)}>
                            {
                                [...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)
                            }
                        </select>
                        <button onClick={doRating} type="button" className="btn btn-outline-success m-3">Rate</button>
                    </div>
                </div>
            </div>
        </li>
    )
}

export default Line;