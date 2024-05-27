import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class NavBarComponent implements OnInit {
  public classContent$: Observable<number>;
  constructor(private sharedService: SharedService) {
    this.classContent$ = this.sharedService.getScrollPercentage();
  }

  ngOnInit(): void {}
}
