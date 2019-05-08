import React, { useEffect, useState } from 'react';
import db from '../config';
import BubbleChart from './charts/BubbleChart';
import BubbleGroupChart from './charts/BubbleGroupChart';

const PopulationDensityLatest = props => {
    const [data, setData] = useState(null);
    const [groupData, setGroupData] = useState(null);
    const [isGroup, setIsGroup] = useState(false);
    const redirectTo = (path = 'population-density', id) => {
        props.history.push(`/${path}/${id}`);
    }

    useEffect(() => {
        (async () => {
            const snapshot = await db.collection('density-by-area').get();
            const response = snapshot.empty ? null : snapshot.docs;
            if(response) 
            {
                const latestDensityArr = response.map(r => {
                    const data = r.data(); 
                    const sortedData = data.density.sort((a, b) => b.year - a.year);
                    let newObj = { region: '', area: '', year: '', value: '' };
                
                    newObj.region = data.region;
                    newObj.area = data.area;
                    newObj.year = sortedData[0].year;
                    newObj.value = sortedData[0].value;

                    return newObj;
              });

              const dataNoParents = latestDensityArr.filter(d => d.region !== 'Cả nước' && d.region !== '');
              const copyOfData = latestDensityArr.filter(d => d.region !== 'Cả nước' && d.region !== '');
              
              // data with hierachy structure
              setGroupData(copyOfData);

              // set data with region only
              setData(dataNoParents);
            }
        })();
    }, []);

    return (
        <div className="row">
            <header className="darken-1 section">
                <h2 className="center">Vietnam Population Density in { data ? data[0].year : '<loading year...>' }</h2>
            </header>
            <div className={ `col s12 m8 ${isGroup ? '' : 'hide'}` }>
                <BubbleGroupChart data = { groupData } redirectTo = { redirectTo } />
            </div>
            <div className={ `col s12 m8 ${isGroup ? 'hide' : ''}` }>
                <BubbleChart data = { data } redirectTo = { redirectTo } />
            </div>
            <div className="col s12 m4 option-panel">
                <label>
                    <input type="checkbox" className="filled-in" checked={ isGroup } onChange={ () => setIsGroup(!isGroup) } />
                    <span>Group by region</span>
                </label>
            </div>
        </div>
    )
}

export default PopulationDensityLatest;
