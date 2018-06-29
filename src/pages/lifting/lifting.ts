import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LiftingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lifting',
  templateUrl: 'lifting.html',
})
export class LiftingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
 goBack(){
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LiftingPage');
  }

}