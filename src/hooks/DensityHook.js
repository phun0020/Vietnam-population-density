import { useState, useEffect } from 'react';
import db from '../config';

const DensityHook = (initArea) => {
    const [data, setData] = useState(null);
    const [area, setArea] = useState(initArea);
  
    const doFetch = async () => {
        const densityRef = db.collection('density-by-area');
        const snapshot = await densityRef.where('area','==', area).get();

        return snapshot.empty ? null : snapshot.docs[0].data();
    }

    useEffect(() => {
        (async () => {
            const doc = await doFetch();
            setData(doc);
        })();
        
    }, [area]);
  
    const getDocByArea = inputArea => setArea(inputArea);
  
    return { getDocByArea, data, doFetch }
}

export default DensityHook;