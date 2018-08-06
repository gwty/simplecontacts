import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Contacts } from './contacts';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class ContactsService {

  private contactsUrl = 'http://0.0.0.0:4000/api';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET contacts from the server */
  getContacts (): Observable<Contacts[]> {
    return this.http.get<Contacts[]>(this.contactsUrl+'/all')
      .pipe(
        tap(contacts => this.log('fetched contacts')),
        catchError(this.handleError('getContacts', []))
      );
  }

  /** GET contact by id. Return `undefined` when id not found */
  getContactsNo404<Data>(id: number): Observable<Contacts> {
    const url = `${this.contactsUrl}/id=${id}`;
    return this.http.get<Contacts[]>(url)
      .pipe(
        map(contacts => contacts[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} contacts id=${id}`);
        }),
        catchError(this.handleError<Contacts>(`getContactsid=${id}`))
      );
  }

  /** GET contacts by id. Will 404 if id not found */
  getContacts2(id: number): Observable<Contacts> {
    const url = `${this.contactsUrl}/id=${id}`;
    return this.http.get<Contacts>(url).pipe(
      tap(_ => this.log(`fetched contacts id=${id} url = ${url}`)),
      catchError(this.handleError<Contacts>(`getContacts2 id=${id}`))
    );
  }

  /* GET contacts whose name contains search term */
  searchContacts(term: string): Observable<Contacts[]> {
    if (!term.trim()) {
      // if not search term, return empty contacts array.
      return of([]);
    }
    return this.http.get<Contacts[]>(`${this.contactsUrl}/first_name=${term}`).pipe(
      tap(_ => this.log(`found contacts matching "${term}"`)),
      catchError(this.handleError<Contacts[]>('searchContacts', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new contact to the server */
  addContacts (contacts: Contacts): Observable<Contacts> {
    return this.http.post<Contacts>(this.contactsUrl, contacts, httpOptions).pipe(
      tap((contacts: Contacts) => this.log(`added contacts w/ id=${contacts.id}`)),
      catchError(this.handleError<Contacts>('addContacts'))
    );
  }

  /** DELETE: delete the contacts from the server */
  deleteContacts (contacts: Contacts | number): Observable<Contacts> {
    const id = typeof contacts === 'number' ? contacts : contacts.id;
    const url = `${this.contactsUrl}/delete/${id}`;

    return this.http.delete<Contacts>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted contacts id=${id}`)),
      catchError(this.handleError<Contacts>('deleteContacts'))
    );
  }
  
  /** DELETE: delete the contacts from the server */
  archiveContacts (contacts: Contacts | number): Observable<Contacts> {
    const id = typeof contacts === 'number' ? contacts : contacts.id;
    const url = `${this.contactsUrl}/archive/${id}`;

    return this.http.delete<Contacts>(url, httpOptions).pipe(
      tap(_ => this.log(`archived contacts id=${id}`)),
      catchError(this.handleError<Contacts>('archiveContacts'))
    );
  }  

  /** PUT: update the contacts on the server */
  updateContacts (contacts: Contacts | number): Observable<any> {
    const id = typeof contacts === 'number' ? contacts : contacts.id;
    const url = `${this.contactsUrl}/update/${id}`;
    return this.http.put(url, contacts, httpOptions).pipe(
      tap(_ => this.log(`updated contacts id=${id}`)),
      catchError(this.handleError<any>('updateContacts'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ContactsService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ContactsService: ${message}`);
  }
}
