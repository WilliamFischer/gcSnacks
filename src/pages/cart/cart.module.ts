import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartPage } from './cart';

import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

@NgModule({
  declarations: [
    CartPage,
  ],
  imports: [
    IonicPageModule.forChild(CartPage),
    Ng4GeoautocompleteModule
  ],
})
export class CartPageModule {}
