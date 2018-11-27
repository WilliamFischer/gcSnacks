import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { PayPal } from '@ionic-native/paypal';

// EXTERNAL MODULES
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';

import { HomePage } from '../pages/home/home';
import { CartPage } from '../pages/cart/cart';

import { OrderPage } from '../pages/order/order';

import { AdminPage } from '../pages/admin/admin';

import { MorePopoverPage } from '../pages/morePopover';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from './credentials';

import { AuthProvider } from '../providers/auth/auth';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Facebook } from '@ionic-native/facebook';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    AdminPage,
    OrderPage,
    MorePopoverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    Ng2SearchPipeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    AdminPage,
    OrderPage,
    MorePopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    InAppBrowser,
    Facebook,
    NativeGeocoder,
    PayPal
  ]
})
export class AppModule {}
