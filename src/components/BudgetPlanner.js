import React, { useState, useEffect } from 'react';
import PieChart from './charts/PieChart';
import M from 'materialize-css';
import '../css/App.css';
import db from '../config';

const BudgetPlanner = () => {
  const [data, setData] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [name, setName] = useState("");
  const [cost, setCost] = useState(0);

  useEffect(() => {
    let newData = [];
    db.collection('expenses').onSnapshot(response => {
        response.docChanges().forEach(change => {
            const doc = { ...change.doc.data(), id: change.doc.id };

            switch(change.type) {
                case 'added':
                newData.push(doc);
                    break;
                case 'modififed':
                    const index = newData.findIndex(item => item.id === doc.id);
                    newData[index] = doc;
                    break;
                case 'removed':
                    newData = newData.filter(item => item.id !== doc.id);
                    break;
                default:
                    break;
            }
        });
        setData(newData);
        setIsChange(false);
    });
  }, [isChange]);

  const createNewItem = async () => {
    const item = {
      name,
      cost
    }

    if(cost > 0 && name !== '' )
    {
      await db.collection('expenses').add(item);
      M.toast({
        html: `${name} has been added`,
        classes: 'rounded gradient-45deg-light-blue-cyan'
      });

      setName("");
      setCost(0);
      setIsChange(true);
    }
    else {
      M.toast({
        html: `require name && cost must be greater than zero`,
        classes: 'rounded gradient-45deg-indigo-purple'
      });
    }
    
  }

  return (
    <div className="row">
      <header className="darken-1 section">
        <h2 className="center">Budget Planner</h2>
      </header>
      <div className="col s12 m6">
        <form className="card z-depth-0">
          <div className="card-content">
            <span className="card-title indigo-text">Add Item:</span>
            <div className="input-field">
              <input type="text" 
              id="name" 
              value={ name } 
              onChange={ e => setName(e.target.value) } />
              <label htmlFor="name">Item Name</label>
            </div>
            <div className="input-field">
              <input type="number" 
              id="cost" 
              value={ cost } 
              onChange={ e => setCost(parseInt(e.target.value)) }/>
              <label htmlFor="cost">Item Cost</label>
            </div>
            <div className="input-field center">
              <button type="button" 
              className="btn-large blue darken-1 white-text"
              onClick={ createNewItem }>Add Item</button>
            </div>
          </div>
        </form>
      </div>
      <div className="col s12 m5 push-m1">
        <PieChart data={ data } />
      </div>
    </div>
  )
}

export default BudgetPlanner;
