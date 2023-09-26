import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  svg: any;

  @Input() nodes;
  @Input() links;

  constructor() {}

  ngOnInit(): void {
    this.drawNodes();
    console.log(this.links);
  }

  drawNodes() {
    // const simulation = d3
    //   .forceSimulation(this.nodes)
    //   .force(
    //     'link',
    //     d3.forceLink(this.links).id((d) => d.id)
    //   )
    //   .force('collide', d3.forceCollide())
    //   .force('manyBody', d3.forceManyBody())
    //   .force('center', d3.forceCenter())
    //   .alpha(0.1);
    // .alphaDecay(0);

    const simulation = d3
      .forceSimulation(this.nodes)
      .force(
        'link',
        d3.forceLink(this.links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    this.svg = d3
      .select('#svgContainer')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [-100, -100, 200, 200]);

    const link = this.svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(this.links)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.value) / 3);

    const node = this.svg
      .append('g')
      .attr('fill', 'grey')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .selectAll('g')
      .data(this.nodes)
      .join('g');
    // .call(drag(simulation));

    node
      .append('circle')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5)
      .attr('r', 3);

    node
      .append('text')
      .attr('x', 5)
      .attr('y', 2)
      .attr('font-size', '6px')
      .text((d) => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
      // node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });
  }
}
