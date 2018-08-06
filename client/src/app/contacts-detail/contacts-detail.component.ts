import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Contacts }         from '../contacts';
import { ContactsService }  from '../contacts.service';

@Component({
  selector: 'app-contacts-detail',
  templateUrl: './contacts-detail.component.html',
  styleUrls: [ './contacts-detail.component.css' ]
})
export class ContactsDetailComponent implements OnInit {
  @Input() contacts: Contacts;

  constructor(
    private route: ActivatedRoute,
    private contactsService: ContactsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.contactsService.getContacts2(id)
      .subscribe(Contacts => this.contacts = Contacts);
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.contactsService.updateContacts(this.contacts[0])
      .subscribe(() => this.goBack());
  }
}
