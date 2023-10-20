import { Component, OnInit } from '@angular/core';
import { testData } from 'src/data/test-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Информация по держателям';
  nodes: any[] = [];
  nodesForSearch: any[] = [];
  links: any[] = [];
  banks: any[] = [];

  ngOnInit(): void {
    testData.forEach((item) => {
      item.AFL_ENT1_ID = item.AFL_ENT1_ID.replace(/,/g, '');
      item.AFL_ENT2_ID = item.AFL_ENT2_ID.replace(/,/g, '');
      const existingLink = this.links.find(
        (link) =>
          link.source === parseInt(item.AFL_ENT1_ID) &&
          link.target === parseInt(item.AFL_ENT2_ID)
      );
      if (existingLink) {
        existingLink.percent += Math.floor(Math.random() * 20) + 1;
      } else {
        this.links.push({
          source: parseInt(item.AFL_ENT1_ID),
          target: parseInt(item.AFL_ENT2_ID),
          color: item.AFL_GRP,
          percent: Math.floor(Math.random() * 20) + 1,
        });
      }
    });

    const output = new Set(testData.map((item) => item.AFL_ENT1_ID));
    const input = new Set(testData.map((item) => item.AFL_ENT2_ID));

    const all = new Set([...output, ...input]);

    this.nodes = [...all]
      .map((item) => {
        return { id: parseInt(item), name: item };
      })
      .sort((a, b) => b.id - a.id);

    this.nodes.forEach((node) => {
      this.banks.push({
        bank: node,
        shareHolders: this.links.filter((link) => link.source === node.id),
      });
    });

    this.nodes.forEach((node) => {
      this.nodesForSearch.push({
        id: node.id,
        visited: false,
        parents: [
          ...new Set(
            this.links
              .filter((link) => link.target === node.id)
              .map((p) => p.source)
          ),
        ],
      });
    });

    // console.log(this.nodesForSearch, this.links);

    this.banks.sort((a, b) => a.bank.id - b.bank.id);

    this.links.forEach((link) => {
      const tmp = this.links.filter(
        (link2) => link2.source === link.source && link2.target === link.target
      );
      // console.log(111, tmp);
    });

    // console.log(this.banks);
    // console.log(this.links);
    // console.log(this.nodes);

    // let treeBank = this.banks.map(bank => bank.child = this.banks.filter(b=>b.node.id));
  }
}
