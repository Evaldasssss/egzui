import { useContext } from 'react';
import Foods from '../../Contexts/Foods';

function Line({ food }) {

    const { setDeleteData, setModalData } = useContext(Foods);

    return (
        <li className="list-group-item">
            <div className="line">
                <div className="line__content">
                    <div className="line__content__info">
                        {food.image ? <div className='img-bin'>
                            <img src={food.image} alt={food.title}>
                            </img>
                        </div> : <span className="red-image">No image</span>}
                    </div>
                    <div className="line__content__title">
                        {food.title}
                    </div>
                    <div className="line__content__info">
                        {food.price} Eur
                    </div>
                    <div className="line__content__info">
                        {food.rating ?? 'no rating'} reitingas
                    </div>
                </div>
                <div className="line__buttons">
                    <button onClick={() => setModalData(food)} type="button" className="btn btn-outline-success">Edit</button>
                    <button onClick={() => setDeleteData(food)} type="button" className="btn btn-outline-danger">Delete</button>
                </div>
            </div>
        </li>
    )
}

export default Line;