import React from 'react';
import BudgetPlanner from './components/BudgetPlanner';
import PopulationDensity from './components/PopulationDensity';
import PopulationDensityLatest from './components/PopulationDensityLatest';
import Navbar from './components/layouts/Navbar';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
        <div className="App">
          <Navbar />
          <div className="container section">
          <Switch>
            <Route exact path="/" component={PopulationDensityLatest} />
            <Route path="/budget-planner" component={BudgetPlanner} />
            <Route path="/population-density/:name?" component={PopulationDensity} />
            <Route path="/population-density-latest" component={PopulationDensityLatest} />
          </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
}

export default App;
