import React from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { useNavigate, Link } from 'react-router-dom';

function SearchResults() {
    const [state] = useStoreContext();
    const { searchResults } = state;
    const navigate = useNavigate();


    return (
        <div className='container-fluid mt-3 text-white'>
            <div className="jcsb" style={{"--gap":'15px'}}>
                {searchResults.map((r) => (
                    <div key={r.id} className="tac" style={{"--grid-w":'5', "--hover-scale":'1.05'}} >
                        <Link to={`/products/${r._id}`}>
                            <div className='p-2 bg-d2 rounded'>
                                <div className="img-div bg-l1">
                                    <img alt={r.name} src={r.image} />
                                </div>
                                <p className='m-0'>{r.name}</p>
                            
                                <div>
                                    <span>${r.price}</span>
                                </div>
                                {/* <button className="btn-1 bg-c1" 
                                    onClick={() =>navigate(`/products/${r._id}`)}
                                >Learn More</button> */}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchResults;