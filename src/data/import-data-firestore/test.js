const data = require('./density-by-area.json');

let newDataFormat;
newDataFormat = data.map((d, i) => {
    let dataArr = [
        {
            "year": 2011,
            "value": d[2011]
        },
        {
            "year": 2012,
            "value": d[2012]
        },
        {
            "year": 2013,
            "value": d[2013]
        },
        {
            "year": 2014,
            "value": d[2014]
        },
        {
            "year": 2015,
            "value": d[2015]
        },
        {
            "year": 2016,
            "value": d[2016]
        }
    ];

    let population = { 
        [i]: {
            "area": d.Area,
            "density": dataArr
        }
    };

    return population;
});

console.log({ "density-by-area": newDataFormat });

