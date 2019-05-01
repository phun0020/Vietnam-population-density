import React, { useEffect, useState } from 'react';
import LineChart from './charts/LineChart';
import DensityHook from '../hooks/DensityHook';
import db from '../config';

const PopulationDensity = ({ match : { params }}) => { //props.match.params.name
    const areaParam = params.name ? params.name : 'Hồ Chí Minh';
    const { getDocByArea, data } = DensityHook(areaParam);
    const [area, setArea] = useState('');
    const [areas, setAreas] = useState(null);

    useEffect(() => {
        (async () => {
            const snapshot = await db.collection('density-by-area').get();
            const result = snapshot.empty ? null : snapshot.docs.map(x => x.data().area);
            
            // get list of areas
            if(result) setAreas(result);
        })();
    }, [])

    useEffect(() => {
        if(data) setArea(data.area);
    }, [data]);

    return (
        <div className="row">
            <header className="darken-1 section">
                <h2 className="center">{ area }</h2>
            </header>
            <div className="col s12 m12 l6">
                <LineChart areaData={ data } />
            </div>
            <div className="input-field col s12 m12 l6">
                <ul className="collection with-header">
                    { areas && areas.map(a => 
                        <li className="collection-item area-item" 
                        onClick={ () => getDocByArea(a) }
                        key={ Math.random() }>{ a }</li>)
                    }
                </ul>
            </div>
        </div>
    )
}

export default PopulationDensity;
