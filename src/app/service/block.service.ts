import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Block } from '../model/block.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlockService {
  private apiUrl = `${environment.apiUrl}/Block`;

  constructor(private http: HttpClient) {}

  getBlocks(): Observable<Block[]> {
    return this.http.get<Block[]>(`${this.apiUrl}/blocks`);
  }

  getBlockById(id: number): Observable<Block> {
    return this.http.get<Block>(`${this.apiUrl}/blocks/${id}`);
  }
}
