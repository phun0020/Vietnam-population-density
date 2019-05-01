import React, { useEffect } from 'react'
import * as d3 from 'd3';
import tip from 'd3-tip';

export default function LineChart({ areaData }) {
    // constants
    const margin = { top: 40, right: 20, bottom: 50, left: 100 };
    const graphWidth = 560 - margin.left - margin.right;
    const graphHeight = 400 - margin.top - margin.bottom;

    //scale
    const x = d3.scaleTime().range([0, graphWidth]);
    const y = d3.scaleLinear().range([graphHeight, 0]);

    // tip
    const tooltip = tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(d => {
            let content = `<div class="name">${d.value}</div>`;
            return content;
    });
    
    const setup = () => {
        const svg = d3.select('.canvas')
            .append('svg')
            .attr('width', graphWidth + margin.left +  margin.right)
            .attr('height', graphHeight + margin.top + margin.bottom);

        const graph = svg.append('g')
            .attr('class', 'graph')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        graph.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${graphHeight})`);

        graph.append('g')
            .attr('class', 'y-axis');

        graph.append('path')
            .attr('class', 'path');

        const dottedLines = graph.append('g')
            .attr('class', 'dotted-lines');

        dottedLines.append('line')
            .attr('id', 'xDottedLine')
            .attr('stroke', '#aaa')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', 4);

        dottedLines.append('line')
            .attr('id', 'yDottedLine')
            .attr('stroke', '#aaa')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', 4);
    };

    const update = (data) => {
        const graph = d3.select('.graph');
        const density = data.density;
        const yearArr = density.map(x => x.year);
        const valueArr = density.map(x => x.value);

        // set scale domains
        x.domain(d3.extent(yearArr, d => new Date(parseInt(d), 0)));
        y.domain([0, d3.max(valueArr, d => d)]);

        // density points
        const circles = graph.selectAll('circle')
            .data(density);
        
        circles.exit().remove();

        circles.attr('cx', d => x(new Date(parseInt(d.year), 0)))
            .attr('cy', d => y(d.value))
        
        circles.enter()
            .append('circle')
            .attr('r', 4)
            .attr('cx', d => x(new Date(parseInt(d.year), 0)))
            .attr('cy', d => y(d.value))
            .attr('fill', '#fff')
            .attr('stroke-width', 4)
            .attr('stroke', '#7b1fa2')
            .attr('stroke-linecap', 'round');

        graph.selectAll('circle')
            .call(tooltip)
            .on('mouseover', (d,i,n) => {
                d3.select(n[i])
                .transition()
                .duration(100)
                .attr('fill', '#7b1fa2')
                .attr('stroke', '#fff');

                // set coordinate for dotted lines
                const circleX = x(new Date(parseInt(d.year), 0));
                const circleY = y(d.value);
                d3.select('line#xDottedLine')
                .attr('x1', circleX)
                .attr('y1', graphHeight)
                .attr('x2', circleX)
                .attr('y2', circleY);

                d3.select('line#yDottedLine')
                .attr('x1', 0)
                .attr('y1', y(d.value))
                .attr('x2', x(new Date(parseInt(d.year), 0)))
                .attr('y2', y(d.value));

                d3.select('.dotted-lines').attr('visibility', 'visible');
                tooltip.show(d, n[i]);
            })
            .on('mouseleave', (d,i,n) => {
                d3.select(n[i])
                .transition()
                .duration(100)
                .attr('fill', '#fff')
                .attr('stroke', '#7b1fa2');

                d3.select('g.dotted-lines').attr('visibility', 'hidden');
                tooltip.hide();
            });
        
        // draw line (sort if need)
        // density.sort((a, b) => parseInt(a.year) - parseInt(b.year))
        const line = d3.line()
            .x(d => x(new Date(parseInt(d.year), 0)))
            .y(d => y(d.value));

        const path = graph.select('.path')
            .data([density]);
        
        path.attr('fill', 'none')
            .attr('stroke', '#9C27B0')
            .attr('stroke-width', 2)
            .attr('d', line);

        // transition path line
        const nodeLength = path.node().getTotalLength();
        path.attr('stroke-dasharray',`${nodeLength} ${nodeLength}`)
            .attr('stroke-dashoffset', `${nodeLength}`)
            .transition()
            .duration(1500)
            .attr('stroke-dashoffset', 0);
        
        // create axes
        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y)
            .tickFormat(d => d + ' p/km');

        // call axes
        d3.select('.x-axis').call(xAxis);
        d3.select('.y-axis').call(yAxis);

        // rotate axis text
        d3.selectAll('.x-axis text')
            .attr('transform', 'rotate(-40)')
            .attr('text-anchor', 'end');
    };

    useEffect(() => {
        if(areaData) update(areaData);
    }, [areaData]);

    useEffect(() => {
        setup(); // run only once
    }, []);

    return ( 
        <div>
            <div className="canvas"></div>
            {/* <defs> // have to be in <svg></svg>
                <linearGradient id="lineLinearStats" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="rgba(255, 82, 249, 0.1)"></stop>
                    <stop offset="10%" stop-color="rgba(255, 82, 249, 1)"></stop>
                    <stop offset="30%" stop-color="rgba(255, 82, 249, 1)"></stop>
                    <stop offset="95%" stop-color="rgba(133, 3, 168, 1)"></stop>
                    <stop offset="100%" stop-color="rgba(133, 3, 168, 0.1)"></stop>
                </linearGradient>
            </defs> */}
        </div>
    )
}
