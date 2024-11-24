import { Component } from '@angular/core';
import { BlockService } from '../../service/block.service';
import { Block } from '../../model/block.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrl: './block.component.css',
})
export class BlockComponent {
  blocks: Block[];

  constructor(private blockService: BlockService, private router: Router) {}

  ngOnInit(): void {
    this.updateBlocks();
  }

  updateBlocks(): void {
    this.blockService.getBlocks().subscribe(
      (blocks) => {
        this.blocks = blocks;
      },
      (error) => {
        console.error('Failed to fetch updated blocks:', error);
      }
    );
  }

  onBlockClick(blockId: number): void {
    this.router.navigate(['/blocks', blockId]);
  }
}
