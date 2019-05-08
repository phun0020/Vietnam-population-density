import React from 'react';
import { Link } from 'react-router-dom';
import reactLogo from './img/react.svg';
import d3Logo from './img/d3.svg';
import firebaseLogo from './img/firebase.svg';

export default function Navbar() {
    const marginRight = { 'marginRight': '2rem' };

    return (
      <nav>
        <div className="nav-wrapper gradient-45deg-light-blue-cyan">
          <Link to="/" className="brand-logo center">
            <img src={ reactLogo } alt='react-logo' width='6%' style={ marginRight }/>
            <img src={ d3Logo } alt='d3-logo' width='6%' style={ marginRight }/>
            <img src={ firebaseLogo } alt='firebase-logo' width='4%' />
          </Link>
          <ul id="nav-mobile" className="left hide-on-med-and-down">
            <li><Link to="/"><i className="fas fa-cookie"></i> Vietnam Population Density</Link></li>
            {/* <li><Link to="/budget-planner"><i className="fas fa-chart-pie"></i> Unrelated Pie Chart</Link></li> */}
            <li><a href='https://github.com/phun0020/Vietnam-population-density' target='_blank' rel='noopener noreferrer'><strong><i className="fab fa-github"></i> Source</strong></a></li>
          </ul>
        </div>
      </nav>
    )
}

