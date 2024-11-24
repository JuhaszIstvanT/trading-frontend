import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockService } from '../../service/block.service';
import { Block } from '../../model/block.model';

@Component({
  selector: 'app-block-detail',
  templateUrl: './block-detail.component.html',
  styleUrl: './block-detail.component.css',
})
export class BlockDetailComponent implements OnInit {
  block: Block;

  constructor(
    private route: ActivatedRoute,
    private blockService: BlockService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const blockId = +params['id'];
      this.blockService.getBlockById(blockId).subscribe((block) => {
        this.block = block;
      });
    });
  }
}
