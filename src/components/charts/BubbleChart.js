import React, {  useEffect } from 'react';
import * as d3 from 'd3';
import tip from 'd3-tip';
import { legendColor } from 'd3-svg-legend';

const BubbleChart = ({ data, redirectTo }) => {
    // constants
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const graphWidth = 800 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;
    const radiusRange = [10, 100];

    // scale for circle color && radius
    const size = d3.scaleLinear().range(radiusRange);
    const color = d3.scaleOrdinal(d3['schemeSet3']);

    // legend of regions
    const legend = legendColor()
        .shape('circle')
        .shapePadding(10)
        .scale(color);

    // tip
    const tooltip = tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(d => {
            let content = `<div class="name">${d.area} - ${d.value}</div>`;
            content += `<div class="tooltip"><small>double click to see detail</small></div>`;
            return content;
        });

    // https://www.d3-graph-gallery.com/graph/circularpacking_template.html
    const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(graphWidth / 2).y(graphHeight / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(d => size(d.value)+3).iterations(1)) // Force that avoids circle overlapping

    const setup = () => {
        const svg = d3.select('.canvas')
            .append('svg')
            .attr('width', graphWidth + margin.left +  margin.right)
            .attr('height', graphHeight + margin.top + margin.bottom);

        svg.append('g')
            .attr('class', 'graph')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            .attr('transform', `translate(${margin.left + 50}, ${-margin.top})`);

        svg.append('g')
            .attr('class', 'legendGroup')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
    };

    const update = (data) => {
        const graph = d3.select('.graph');
        size.domain([0, d3.max(data, d => d.value)]);

        const circles = graph.selectAll('circle').data(data);
        circles.exit().remove();

        // legend
        color.domain(data.map(d => d.region));

        const legendGroup = d3.select('.legendGroup');
        legendGroup.call(legend);
        legendGroup.selectAll('text').attr('fill', 'black');

        // append circle
        const node = circles.enter()
            .append('circle')
            .attr('r', d => size(d.value))
            .attr('cx', graphWidth / 2)
            .attr('cy', graphHeight / 2)
            .attr('fill', d => color(d.region));
        
        graph.selectAll('circle')
            .call(tooltip)
            .on('mouseover', (d,i,n) => {
                tooltip.show(d, n[i]);
            }).on('mouseleave', (d,i,n) => {
                tooltip.hide();
            }).on('dblclick', (d,i,n) => {
                redirectTo('population-density', d.area);
                tooltip.hide();
            });
        
        node.call(d3.drag() // call specific function when circle is dragged
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
        
         // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation.nodes(data).on("tick", d => {
              node
              .attr("cx", d => d.x)
              .attr("cy", d => d.y)
        });

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
    
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
            tooltip.hide();
        }
        
        function dragended(d, i, n) {
            if (!d3.event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
            tooltip.show(d, n[i]);
        }
    };

    useEffect(() => {
        if(data) update(data);
    }, [data]);

    useEffect(() => {
        setup();
    }, []);

    return (<div className="canvas"></div>)
}

export default BubbleChart;
