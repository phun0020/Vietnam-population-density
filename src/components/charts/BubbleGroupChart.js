import React, {  useEffect } from 'react';
import * as d3 from 'd3';
import tip from 'd3-tip';
import { legendColor } from 'd3-svg-legend';

export default function BubbleGroupChart({data, redirectTo}) {
    // constants
    const margin = { top: 0, right: 20, bottom: 30, left: 50 };
    const graphWidth = 800 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;

    // scale for circle color
    const color = d3.scaleOrdinal(['#d1c4e9', '#b39ddb', '#9575cd']);

    // legend of regions
    const legend = legendColor()
        .shape('circle')
        .shapePadding(25)
        .scale(color);

    // tip
    const tooltip = tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(d => {
            let content = `<div class="name">${d.data.area} - ${d.data.value}</div>`;
            content += `<div class="tooltip"><small>double click to see detail</small></div>`;
            return content;
        });

    const setup = () => {
        const svg = d3.select('.canvas1')
            .append('svg')
            .attr('width', graphWidth + margin.left +  margin.right)
            .attr('height', graphHeight + margin.top + margin.bottom);

        svg.append('g')
            .attr('class', 'graph1')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            .attr('transform', `translate(${margin.left + 50}, ${-margin.top})`);

        svg.append('g')
            .attr('class', 'legendGroup1')
            .attr('transform', `translate(${margin.left}, ${20})`);
    };

    const update = (data) => {
        const graph = d3.select('.graph1');

        // stratify to Hierarchy Data 
        const stratify = d3.stratify()
            .id(d => d.area)
            .parentId(d => d.region);
        
        const node = stratify(data)
            .sum(d => d.value); // just a sum not density
        
        // pack settings
        const pack = d3.pack()
            .size([graphWidth, graphHeight])
            .padding(10);

        // turn it pack to regular array
        const bubbleData = pack(node).descendants();

        // color domain & legend
        color.domain(bubbleData.map(d => d.depth));

        const legendGroup = d3.select('.legendGroup1');
        legendGroup.call(legend);
        legendGroup.selectAll('text').attr('fill', 'black');

        const nodes = graph.selectAll('g')
            .data(bubbleData)
            .enter()
            .append('g')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        nodes.append('circle')
            .attr('r', d => d.r)
            .attr('fill', d => color(d.depth));
        
        const a = nodes.filter(d => d.children)
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dy','0.3em')
            .attr('fill', 'black')
            .attr('transform', d => `translate(0, ${-d.r})`)
            .style('font-size', '15px')
            .text(d => d.data.area);

        nodes.filter(d => !d.children)
            .call(tooltip)
            .on('mouseover', (d,i,n) => {
                tooltip.show(d, n[i]);
            }).on('mouseleave', (d,i,n) => {
                tooltip.hide();
            }).on('dblclick', (d,i,n) => {
                redirectTo('population-density', d.data.area);
                tooltip.hide();
            });
            
    };

    // add parent to leaf
    const addParentToLeaf = (data) => {
        const regionArr = data.map(x => x.region);
        const uniqueRegionArr = [...new Set(regionArr)];
        const regionNodeArr = uniqueRegionArr.map(r => {
            return { region: 'Cả nước', area: r };
        });
        const rootNode = { region: '', area: 'Cả nước' };
        const dataWithParent = [...data, ...regionNodeArr, rootNode];

        return dataWithParent;
    }

    useEffect(() => {
        setup();
    }, []);

    useEffect(() => {
        if(data) {
            const dataWithParents = addParentToLeaf(data);
            update(dataWithParents);
        }
    }, [data]);
    
    return (
        <div>
            <div className='canvas1'></div>
        </div>
    )
}
