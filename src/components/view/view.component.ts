import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import * as svg from 'save-svg-as-png';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, AfterViewInit {
  svg: any;

  @Input() nodes;
  @Input() links;

  @ViewChild('svgContainer') svgContainer: ElementRef;

  width: number;
  height: number;

  constructor() {}

  ngOnInit(): void {
    this.drawNodes();
  }

  ngAfterViewInit(): void {
    this.width = this.svgContainer?.nativeElement.offsetWidth;
    this.height = this.svgContainer?.nativeElement.offsetHeight;
    console.log(this.width, this.height);
  }

  drawNodes() {
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute');

    const simulation = d3
      .forceSimulation(this.nodes)
      .force(
        'link',
        d3.forceLink(this.links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    const zoomed = (event) => {
      const transform = event.transform;
      this.svg.attr(
        'transform',
        'translate(' +
          transform.x +
          ',' +
          transform.y +
          ') scale(' +
          transform.k +
          ')'
      );
    };

    d3.select('#svgContainer')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [-100, -100, 200, 200])
      .call(d3.zoom().on('zoom', zoomed));

    this.svg = d3.select('#svg');

    this.svg
      .append('svg:defs')
      .selectAll('marker')
      .data(['end']) // Different link/path types can be defined here
      .enter()
      .append('svg:marker') // This section adds in the arrows
      .attr('id', String)
      .attr('viewBox', '0 -5 15 15')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('markerWidth', 5)
      .attr('markerHeight', 15)
      .attr('orient', 'auto')
      .attr('fill', 'grey')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    const link = this.svg
      .append('g')
      .attr('stroke', 'grey')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(this.links)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.value) / 3)
      .attr('marker-end', 'url(#end)')
      .on('mouseenter', function (e, d) {
        tooltip.transition().style('opacity', 0.9);
        tooltip
          .html(`${d.percents}%`)
          .style('left', e.pageX + 10 + 'px')
          .style('top', e.pageY + 10 + 'px');
      })
      .on('mouseout', function () {
        tooltip.transition().duration(500).style('opacity', 0);
      })
      .on('click', function (event, data) {
        d3.selectAll('circle').attr('fill', 'grey');
        d3.selectAll('circle')
          .filter((node) => {
            return node.id === data.source.id;
          })
          .attr('fill', 'red');
        d3.selectAll('circle')
          .filter((node) => {
            return node.id === data.target.id;
          })
          .attr('fill', 'green');
        d3.selectAll('line').attr('stroke', 'grey');
        d3.select(this).attr('stroke', 'blue');
      });

    const node = this.svg
      .append('g')
      .attr('fill', 'grey')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .selectAll('g')
      .data(this.nodes)
      .join('g')
      // .on('mouseover', function () {
      //   d3.select(this).attr('r', 10).style('fill', 'black');
      // })
      // .on('mouseout', function () {
      //   d3.select(this).attr('r', 5.5).style('fill', 'grey');
      // })
      .on('click', function (event, data) {
        d3.selectAll('circle').attr('fill', 'grey');
        d3.selectAll('line').attr('stroke', 'grey');
        d3.select(this).select('circle').attr('fill', 'red');
        data.shareholders.forEach((shareholder) => {
          d3.selectAll('circle')
            .filter((node) => {
              return shareholder.companyId === node.id;
            })
            .attr('fill', 'blue');
        });

        d3.selectAll('circle')
          .filter((node) =>
            node.shareholders.some(
              (shareholder) => shareholder.companyId === data.id
            )
          )
          .attr('fill', 'green');

        d3.selectAll('line')
          .filter((line) => line.source.id === data.id)
          .attr('stroke', 'blue');
        d3.selectAll('line')
          .filter((line) => line.target.id === data.id)
          .attr('stroke', 'green');

        // d3.select('line').attr('stroke', 'blue');
      });

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

    node.call(
      d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    );

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
      // node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });

    function dragstarted(event) {
      if (!event.active) {
        // simulation.restart();

        simulation.alphaTarget(0.01).restart();
      }
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) {
        simulation.alphaTarget(0);
        // simulation.stop();
      }
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }

  savePDF() {
    svg.saveSvgAsPng(document.getElementById('svgContainer'), 'graph.png', {
      backgroundColor: '#fff',
      left: -this.width / 2,
      top: -this.height / 2,
      width: this.width,
      height: this.height,
      scale: 2,
    });
  }
}
