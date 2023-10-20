import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import * as svgToPng from 'save-svg-as-png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, AfterViewInit {
  svg: any;

  @Input() nodes;
  @Input() nodesForSearch;
  @Input() links;

  @ViewChild('svgContainer') svgContainer: ElementRef;

  width: number;
  height: number;
  simulation: any;
  manualMode: boolean = false;

  selectedNode;

  constructor() {}

  ngOnInit(): void {
    this.drawNodes();
    // this.selectedNode = 9125165;
    // this.pathToLeave = [];
    // this.findParentsNodes(this.selectedNode);
    // this.onChange();
    // console.log('pathToLeave', this.pathToLeave);
  }

  pathToLeave = [];

  onChange() {
    const tmp = this.nodes.find(
      (node) => node.id === parseInt(this.selectedNode)
    );
    this.pathToLeave = [];
    this.nodesForSearch.forEach((node) => (node.visited = false));
    this.findParentsNodes(tmp.id);

    if (this.pathToLeave.includes(-1)) {
      d3.selectAll('circle')
        .attr('fill', 'grey')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .attr('r', 3)
        .filter((node) => this.pathToLeave.includes(node.id))
        .attr('fill', 'red')
        .attr('stroke', 'green')
        .filter((node) => tmp.id === node.id)
        .attr('fill', 'blue')
        .attr('stroke', 'green')
        .attr('stroke-width', 0.5)
        .attr('r', 5);

      d3.selectAll('line')
        .attr('stroke', 'grey')
        .filter(
          (line) =>
            this.pathToLeave.includes(line.source.id) &&
            this.pathToLeave.includes(line.target.id)
        )
        .attr('stroke', 'red');
    } else {
      d3.selectAll('circle')
        .attr('fill', 'grey')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .attr('r', 3)
        .filter((node) => tmp.id === node.id)
        .attr('fill', 'blue')
        .attr('stroke', 'green')
        .attr('stroke-width', 0.5)
        .attr('r', 5);
    }
    // this.svg.attr(
    //   'transform',
    //   'translate(' + -(tmp.x - 100) + ',' + -(tmp.y - 100) + '), scale(1)'
    // );
  }

  findParentsNodes(nodeId) {
    const currentNode = this.nodesForSearch.find((node) => node.id === nodeId);
    console.log('currentNode', currentNode);

    if (currentNode && !currentNode.visited) {
      currentNode.visited = true;
      this.pathToLeave.push(nodeId);
      for (let parentId of currentNode.parents) {
        const parentNode = this.nodesForSearch.find(
          (node) => node.id === parentId
        );

        if (!parentNode.visited && parentNode.parents?.length > 0) {
          this.findParentsNodes(parentId);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    this.width = this.svgContainer?.nativeElement.offsetWidth;
    this.height = 800;
  }

  drawNodes() {
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute');

    this.simulation = d3
      .forceSimulation(this.nodes)
      .force(
        'link',
        d3.forceLink(this.links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody().strength(-50))
      // .force('center', d3.forceCenter(-100, -100))
      .force('x', d3.forceX())
      .force('y', d3.forceY());
    // .force('alpha', 0.5);
    // .force(
    //   'link',
    //   d3
    //     .forceLink()
    //     .links(this.links)
    //     .id((d) => d.id)
    // );
    // .alphaTarget(1);

    const zoomed = (event) => {
      // console.log(event);

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
      // .attr('width', '100%')
      // .attr('height', '100%')
      .attr('viewBox', [0, 0, 200, 300])
      .call(d3.zoom().on('zoom', zoomed));

    this.svg = d3.select('#svg');
    // .attr('transform', 'scale(' + 0.2 + ')');

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
      .attr('stroke', (d) => getColor(d))
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
        // d3.selectAll('circle')
        //   .filter((node) => {
        //     return node.id === data.source.id;
        //   })
        //   .attr('fill', 'red');
        // d3.selectAll('circle')
        //   .filter((node) => {
        //     return node.id === data.target.id;
        //   })
        //   .attr('fill', 'green');
        d3.selectAll('line').attr('stroke', 'grey');
        d3.select(this).attr('stroke', 'blue');
      });

    const label = this.svg
      .append('g')
      .selectAll('text')
      .data(this.links)
      .enter()
      .append('text')
      // .attr('x', function (d) {
      //   return (d.source.vx + d.target.vx) / 2;
      // })
      // .attr('y', function (d) {
      //   return (d.source.y + d.target.vy) / 2;
      // })
      .attr('color', 'black')
      .attr('font-size', '6px')
      .text((d) => d.percent + '%');

    function getColor(item) {
      switch (item.color) {
        case 'ГЛ2':
          return 'red';
        case 'ГЛ8-7':
          return 'grey';
        case 'ГЛ1':
          return 'blue';
        case 'ГЛ8-1':
          return 'green';
        case 'ГЛ8-9':
          return 'yellow';
        case 'ГЛ8-2':
          return 'brown';
        case 'ГЛ5':
          return 'black';
        case 'ГЛ8-5':
          return 'aqua';
        case 'ГЛ9':
          return 'violet';
        default:
          return 'grey';
      }
    }

    const node = this.svg
      .append('g')
      .attr('fill', 'grey')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .selectAll('g')
      .data(this.nodes)
      .join('g')
      .on('click', function (event, data) {
        d3.selectAll('circle').attr('fill', 'grey');
        d3.selectAll('line').attr('stroke', 'grey');
        d3.select(this).select('circle').attr('fill', 'red');
        // data.shareholders.forEach((shareholder) => {
        //   d3.selectAll('circle')
        //     .filter((node) => {
        //       return shareholder.companyId === node.id;
        //     })
        //     .attr('fill', 'blue');
        // });

        // d3.selectAll('circle')
        //   .filter((node) =>
        //     node.shareholders.some(
        //       (shareholder) => shareholder.companyId === data.id
        //     )
        //   )
        //   .attr('fill', 'green');

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

    // let simulation = this.simulation;

    node.call(
      d3
        .drag()
        .on('start', (event) => {
          if (!event.active) {
            // this.simulation.restart();
            this.simulation.alphaTarget(0.5).restart();
          }
          if (this.manualMode) {
            node.each((d) => {
              if (event.subject.id !== d.id) {
                d.fx = d.x;
                d.fy = d.y;
              }
            });
          }
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on('drag', (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
          if (this.manualMode) {
            node.each((d) => {
              if (event.subject.id !== d.id) {
                d.fx = d.x;
                d.fy = d.y;
              }
            });
          } else {
            node.each((d) => {
              if (event.subject.id !== d.id) {
                d.fx = undefined;
                d.fy = undefined;
              }
            });
          }
        })
        .on('end', (event) => {
          if (!event.active) {
            this.simulation.alphaTarget(0.5);
            this.simulation.stop();
          }
          event.subject.fx = null;
          event.subject.fy = null;
        })
    );

    this.simulation.on('tick', () => {
      node.attr('transform', (d) => {
        if (d.id === -1) {
          d.x = 100;
          d.y = 100;
        }
        return `translate(${d.x},${d.y})`;
      });
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);
      label
        .attr('x', (d) => (d.source.x + d.target.x) / 2)
        .attr('y', (d) => (d.source.y + d.target.y) / 2);

      // node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });
  }

  savePNG() {
    // console.log(this.svgContainer?.nativeElement.children);
    // console.log(document.getElementById('svgContainer'));

    svgToPng.saveSvgAsPng(
      this.svgContainer?.nativeElement.children[0],
      'graph.png',
      {
        backgroundColor: '#fff',
        left: 0,
        // right: 350,
        top: 0,
        // bottom: 0,
        width: 350,
        height: 350,
        scale: 10,
      }
    );
  }

  savePDF() {
    html2canvas(document.getElementById('svgContainer1'), {
      scale: 10,
      // width: 700,
      // height: 700,
    }).then((canvas) => {
      console.log(canvas);

      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;

      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a3');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

      PDF.save('angular-demo.pdf');
    });
  }

  continieSimulation() {
    this.simulation.alphaTarget(1).restart();
  }
  stopSimulation() {
    this.simulation.stop();
  }
}
