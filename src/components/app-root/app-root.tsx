<reference types="firebase" />

declare var firebase: firebase.app.App;

import { Component, Prop, Listen, Event, EventEmitter, State } from '@stencil/core';
import { authState } from 'rxfire/auth';
// import { collectionData } from 'rxfire/firestore';
import { filter } from 'rxjs/operators';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})



export class AppRoot {

  @State() user = null

  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement;

  @Event() loginCompleted: EventEmitter

  private router = null
  private appRootLoaded = false

  componentDidLoad() {
    this.appRootLoaded = true
    // if (this.user !== null && this.router !== null) { this.router.push("/") }
    if (this.user !== null && this.router !== null) { this.loginCompleted.emit() }
  }

  @Listen('userUpdated')
  userUpdatedHandler(ev) {
    this.user = ev.detail
    // this.loginCompleted.emit()
    // if (this.user !== null && this.router !== null) { this.router.goBack() }
    // if (this.user !== null && this.router !== null) { this.router.push("/") }
    if (this.user !== null && this.router !== null) { this.loginCompleted.emit() }
  }

  @Listen('loginCompleted')
  loginCompletedHandler(ev) {
    this.router.push("/")
  }

  /**
   * Handle service worker updates correctly.
   * This code will show a toast letting the
   * user of the PWA know that there is a
   * new version available. When they click the
   * reload button it then reloads the page
   * so that the new service worker can take over
   * and serve the fresh content
   */
  @Listen('window:swUpdate')
  async onSWUpdate() {
    const toast = await this.toastCtrl.create({
      message: 'New version available',
      showCloseButton: true,
      closeButtonText: 'Reload'
    });
    await toast.present();
    await toast.onWillDismiss();
    window.location.reload();
  }

  render() {
    return (
      <ion-app>
        <ion-router useHash={false} ref={(el)=>this.router = el}>
          {((this.appRootLoaded !== null) && (this.user === null))
             && <ion-route-redirect from="*" to="/login"/> }
          <ion-route url="/" component="app-home" />
          <ion-route url="/login" component="app-login"/>
        </ion-router>
        <app-commands>
          <ion-nav />
        </app-commands>
      </ion-app>
    );
  }
}
