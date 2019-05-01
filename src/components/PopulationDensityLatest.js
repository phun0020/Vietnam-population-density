import React, { useEffect, useState } from 'react';
import db from '../config';
import BubbleChart from './charts/BubbleChart';

const PopulationDensityLatest = props => {
    const [data, setData] = useState(null);
    const redirectTo = (path = 'population-density', id) => {
        props.history.push(`/${path}/${id}`);
    }

    useEffect(() => {
        (async () => {
            const snapshot = await db.collection('density-by-area').get()
            const response = snapshot.empty ? null : snapshot.docs;
            if(response) 
            {
              const latestDensityArr = response.map(r => {
                const data = r.data(); 
                const sortedData = data.density.sort((a, b) => b.year - a.year);
                let newObj = { region: '', area: '', year: '', value: '' }
              
                newObj.region = data.region ? data.region : 'none';
                newObj.area = data.area;
                newObj.year = sortedData[0].year;
                newObj.value = sortedData[0].value;

                return newObj;
              });

              // set data with region only
              setData(latestDensityArr.filter(d => d.region !== 'none'));
            }
        })();
    }, []);

    return (
        <div className="row">
            <header className="darken-1 section">
                <h2 className="center">Vietnam Population Density in { data ? data[0].year : '<loading year...>' }</h2>
            </header>
            <div className="col s12 m12 l8">
                <BubbleChart data = { data } redirectTo = { redirectTo }/>
            </div>
        </div>
    )
}

export default PopulationDensityLatest;
