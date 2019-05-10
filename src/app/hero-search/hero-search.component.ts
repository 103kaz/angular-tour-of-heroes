import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import { Hero } from '../Hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  // 検索語をobservableストリームにpushする
  search(term: string) {
    this.searchTerms.next(term);
  }

  ngOnInit() {
    this.heroes$ = this.searchTerms
      .pipe(
        // 各キーストロークの後、検索前に300ms待つ
        debounceTime(300),
  
        // 直前の検索語と同じ場合は無視する
        distinctUntilChanged(),
  
        // 検索語が変わる度に、新しい検索observableにスイッチする
        switchMap((term: string) => this.heroService.searchHeroes(term)),
      );
  }

}
