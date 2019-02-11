// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

// Core App Import
import { MyApp } from './app.component';

// Pages
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { CartPage } from '../pages/cart/cart';
import { OrderPage } from '../pages/order/order';
import { AdminPage } from '../pages/admin/admin';
import { PastOrdersPage } from '../pages/past-orders/past-orders';

// Widgets
import { MorePopoverPage } from '../pages/morePopover';

// Providers
import { AuthProvider } from '../providers/auth/auth';

// Ionic Native
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { PayPal } from '@ionic-native/paypal';
import { Facebook } from '@ionic-native/facebook';

// External Modules
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from './credentials';



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
    Ng2SearchPipeModule,
    Ng4GeoautocompleteModule.forRoot()
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
