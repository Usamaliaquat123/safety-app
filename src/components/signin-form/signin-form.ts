import { HomePage } from './../../pages/home/home';

import { Component, ReflectiveInjector } from '@angular/core';
import { NavController, NavParams ,LoadingController } from 'ionic-angular';
import { MainPage} from './../../pages/main/main';
import { SignupPage } from './../../pages/signup/signup';
import { ForgotPasswordPage } from './../../pages/forgot-password/forgot-password';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { constant as ENV } from '../../configs/constant';
import  firebase  from "firebase";
import { DeviceAccounts } from "@ionic-native/device-accounts";
@Component({
  selector: 'signin-form',
  templateUrl: 'signin-form.html'
})
export class SigninFormComponent {
	mainPage= MainPage;
  loginForm = {};
	authForm : FormGroup;
	response: any;

  constructor(public  deviceAccount : DeviceAccounts,public loadCtrl : LoadingController,public navCtrl: NavController,  private httpClient: HttpClient,  public navParams: NavParams, private fb: FormBuilder, private storage: Storage) {

		console.log(ENV.BASE_URL);
		this.response = false;
		this.authForm = fb.group({
		  'email' : [null, Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{2,}@[a-zA-Z-_.]{2,}[.]{1}[a-zA-Z]{2,}')])],
		  'password': [null, Validators.compose([Validators.required, Validators.minLength(8) ])]
		});





	
	}


 
  	//load(){}
	forgotPasswordLoad(){this.navCtrl.push(ForgotPasswordPage)}
  signupLoad(){this.navCtrl.push(SignupPage)}
  

  submitForm(value: any):void{
		const loadCtrlStart = this.loadCtrl.create({
			content: 'Please wait...'
		});
		loadCtrlStart.present();
		console.log('Form submitted!')
		console.log(value.email);
		const req = this.httpClient.post(ENV.BASE_URL + 'users/app/login', {
						userEmail: value.email,
						userPassword: value.password
					})
					.subscribe((res: any) => {
						loadCtrlStart.dismiss();
									console.log(res);
									this.storage.set('Session.userEmail', value.email);
									this.storage.set('Session.user_name', res.data.userName);
									this.storage.set('Session.user_id', res.data.userId);
									this.storage.set('Session.access_token', res.data.token);
									this.storage.set('Session.token_expiry', res.data.expiry);
									this.storage.set('Session.profile_pic', res.data.profilePicture);
									this.storage.set('Session.company_logo', res.data.companyLogo);
						
										this.navCtrl.push(MainPage).then(() => {
											const index = this.navCtrl.getActive().index;
											this.navCtrl.remove(0,index);
										});
														
						
				},err => {
					loadCtrlStart.dismiss();
							this.response = true;
							console.log("Error occurred");
							console.log(err);
						
						}
					);		
  }	
	
	// getEmail(){
	// 	console.log('working');
	// 	this.deviceAccount.get().then(data => {
	// 		console.log(data)
	// 	}).catch(err => {
	// 		console.log(err);
	// 	})
	// }



}

