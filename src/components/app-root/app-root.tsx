
import { Component, Prop, Listen, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})

export class AppRoot {

  private user = null

  @State() userSignedIn: boolean = false
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement;

  @Event() loginCompleted: EventEmitter

  private router = null
  @State() appRootLoaded = false

  componentDidLoad() {
    this.appRootLoaded = true
    if (this.user !== null) { this.loginCompleted.emit() }
  }

  @Listen('userUpdated')
  userUpdatedHandler(ev) {
    this.user = ev.detail

    if (this.user === null) {
      this.userSignedIn = false
    } else {
      this.userSignedIn = true
    }

    if (this.appRootLoaded) { this.loginCompleted.emit() }
  }

  @Listen('loginCompleted')
  async loginCompletedHandler(ev) {
    // await this.router.componentOnReady()
    // this.router.push("/")
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

  chooseDefaultRoute = () => {
    if (this.userSignedIn === false) {
      return <ion-route-redirect from="*" to="/login" />;
    } else {
      return <ion-route-redirect from="/login" to={"/" + this.user.uid + "/events"}/>
    }
  }

  setHomeRedidirect() {
    if (this.userSignedIn) {
      console.log(this.user.uid)
      return <ion-route-redirect from="/" to={"/" + this.user.uid + "/events"}/>
    }
  }

  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>

          { this.chooseDefaultRoute() }

          <ion-route url="/:userid/events/add" component="app-edit-event"/>
          <ion-route url="/:userid/events/:eventId/edit" component="app-edit-event"/>
          <ion-route url="/:userid/events" component="app-home"/>
          <ion-route url="/login" component="app-login"/>

        </ion-router>
        <app-commands>
          <ion-nav />
        </app-commands>
      </ion-app>
    );
  }
}
