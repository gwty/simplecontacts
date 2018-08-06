import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Contacts } from '../contacts';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-contacts-search',
  templateUrl: './contacts-search.component.html',
  styleUrls: [ './contacts-search.component.css' ]
})

export class ContactsSearchComponent implements OnInit {
  contacts$: Observable<Contacts[]>;
  private searchTerms = new Subject<string>();

  constructor(private contactsService: ContactsService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.contacts$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.contactsService.searchContacts(term)),
    );
  }
}
