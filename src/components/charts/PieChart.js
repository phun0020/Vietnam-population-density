import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import tip from 'd3-tip';
import db from '../../config';

export default function PieChart({ data }) {
    const dims = { height: 300, width: 300, radius: 150 };
    const center = { 
        x: (dims.width / 2 + 5),
        y: (dims.height / 2 + 5)
    };

    const color = d3.scaleOrdinal(d3['schemeSet3']);
    const legend = legendColor()
        .shape('circle')
        .shapePadding(10)
        .scale(color);
    
    const tooltip = tip()
        .attr('class', 'd3-tip')
        .html(d => {
            let content = `<div class="name">${d.data.name}</div>`;
            content += `<div class="cost">${d.data.cost}</div>`;
            content += `<div class="message">Click slide to remove</div>`;
            return content;
        });

    const arcPath = d3.arc()
            .outerRadius(dims.radius)
            .innerRadius(dims.radius / 2);

    // draw chart at the beginning
    const drawChart = () => {
        const svg = d3.select('.canvas')
            .append('svg')
            .attr('width', dims.width + 250)
            .attr('height', dims.height + 250);
        
        svg.append('g')
            .attr('class', 'graphGroup')
            .attr('transform', `translate(${center.x}, ${center.y})`);

        svg.append('g')
            .attr('class', 'legendGroup')
            .attr('transform', `translate(${dims.width + 40}, 10)`);
    }

    // update when get data from parent component
    const update = (data) => {
        const graph = d3.select('.graphGroup');

        // update color
        color.domain(data.map(d => d.name))

        // update legend
        const legendGroup = d3.select('.legendGroup');
        legendGroup.call(legend);
        legendGroup.selectAll('text').attr('fill', 'black');

        // update data
        const pie = d3.pie()
                    .sort(null)
                    .value(d => d.cost);

        const paths = graph.selectAll('path')
            .data(pie(data));

        // delete data
        paths.exit()
            .transition().duration(750)
            .attrTween('d', arcTweenExit)
            .remove();
        
        paths.attr('d', arcPath)
            .transition().duration(750)
            .attrTween('d', arcTweenUpdate);

        paths.enter()
            .append('path')
                .attr('class', 'arc')
                .attr('fill', d => color(d.data.name))
                .each(function(d) { this._current = d }) //save current path to _current
                .transition().duration(750)
                .attrTween('d', arcTweenEnter);

        graph.selectAll('path')
            .call(tooltip)
            .on('mouseover', (d, i, n) => {
                handleMouseOver(d, i, n);
                tooltip.show(d, n[i]);
            })
            .on('mouseout', (d, i, n) => {
                handleMouseOut(d, i, n);
                tooltip.hide();
            })
            .on('click', handOnClick)
    }

    const handleMouseOver = (d, i, n) => { // data, index, array of elements
        d3.select(n[i]) // n[i] current element
        .transition('changeSliceFill').duration(300)
        .attr('fill', '#fff');
    }

    const handleMouseOut = (d, i, n) => {
        d3.select(n[i])
        .transition('changeSliceFill').duration(300)
        .attr('fill', color(d.data.name));
    }

    const handOnClick = (d) => {
        const id = d.data.id;
        db.collection('expenses').doc(id).delete();
        tooltip.hide();
    }

    const arcTweenEnter = (d) => {
        let i = d3.interpolate(d.endAngle, d.startAngle);
      
        return t => {
          d.startAngle = i(t);
          return arcPath(d);
        };
    }

    const arcTweenExit = (d) => {
        let i = d3.interpolate(d.startAngle, d.endAngle);
      
        return t => {
          d.startAngle = i(t);
          return arcPath(d);
        };
    }

    function arcTweenUpdate(d) {
        // not only angle but the whole object
        let i = d3.interpolate(this._current, d);
        this._current = i(1); // same with this_current = d;

        return t => arcPath(i(t));
    }

    useEffect(() => {
        drawChart();
    }, []);

    useEffect(() => {
        update(data);
    }, [data]);

    return (
        <div className="canvas"></div>
    )
}
