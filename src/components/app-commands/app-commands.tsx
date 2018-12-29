<reference types="firebase" />

declare var firebase: firebase.app.App;

import { Component, Prop, Listen, Event, EventEmitter, State } from '@stencil/core';
import { authState } from 'rxfire/auth';
// import { collectionData } from 'rxfire/firestore';
import { filter } from 'rxjs/operators';
import { from, Subject } from 'rxjs';

@Component({
  tag: 'app-commands'
})

export class AppCommands {

  @Event() userUpdated: EventEmitter

  componentWillLoad() {
    // User logged out
    authState(firebase.auth())
      .pipe(filter(user => user === null))
      .subscribe(() => {
        var newUser = null;
        this.userUpdated.emit(newUser)
    })
    // User logged in
    authState(firebase.auth())
      .pipe(filter(user => user !== null))
      .subscribe((user) => {
        var newUser = user;
        this.userUpdated.emit(newUser)
    })
  }

  @Listen('loginRequested')
  loginRequestedHandler(ev) {
    var status = ev.detail.status
    var provider = new (firebase.auth as any).GoogleAuthProvider()
    var loginObservable = from(firebase.auth().signInWithPopup(provider))
    loginObservable.subscribe(
      () => status.next(),
      () => status.error(),
      () => status.complete()
    )
  }
  @Listen('logoutRequested')
  logoutRequestedHandler(ev) {
    var status = ev.detail.status
    var loginObservable = from(firebase.auth().signOut())
    loginObservable.subscribe(
      () => status.next(),
      () => status.error(),
      () => status.complete()
    )
  }

}
