
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProfilePage} from '../profile/profile';
import { InformationPage} from '../information/information';
import { PreviousPage} from '../previous/previous';
import { WorkPage } from '../work/work';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import firebase from 'firebase'

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
		// firebase.auth().onAuthStateChanged(user => {
		// 	if(user){
		// 		firebase.database().ref(`profile/${user.uid}`).once('value').then(snapshot => {
		// 			this.storage.set('Session.user_name', snapshot.val().userName);
		// 			this.storage.set('Session.user_id', snapshot.val().userId);
		// 			this.storage.set('Session.access_token', snapshot.val().token);
		// 			this.storage.set('Session.token_expiry', snapshot.val().expiry);
		// 			this.storage.set('Session.profile_pic', snapshot.val().profilePicture);
		// 			this.storage.set('Session.company_logo',snapshot.val().companyLogo);
		// 			console.log(snapshot.val());
		// 		})
		// 	}
		// })
  }
  
  logout(){
	console.log('logout');  
	// clearing up sessions values 
	this.storage.ready().then(() => {
		this.storage.remove('Session.user_name').then(() => { console.log('deleted')});
		this.storage.remove('Session.user_id');
		this.storage.remove('Session.access_token');
		this.storage.remove('Session.token_expiry');
		this.storage.remove('Session.profile_pic');
		this.storage.remove('Session.company_logo');	
		this.storage.clear();  
	});	
		firebase.auth().signOut().then(() => {
			this.navCtrl.push(HomePage);
		})
    
  }


//profileLoad = function(){this.navCtrl.push(PassObservationPage); console.log('click');}  
profileLoad = function(){this.navCtrl.push(ProfilePage)}
previousLoad = function(){this.navCtrl.push(PreviousPage)}
informationLoad = function(){this.navCtrl.push(InformationPage)}
workLoad = function(){this.navCtrl.push(WorkPage)}

}
