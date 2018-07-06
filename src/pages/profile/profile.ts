import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { constant as ENV } from '../../configs/constant';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
      response: any;
      baseUrl='http://clients3.5stardesigners.net/safetyapp/api/web/v1/';
      errors : any ; 
      userid :any;
      user :any;
      userData :any;
      userName :any;
      email: any;
      company: any;
      dept :any;
      nameOfReceiveReport :any;
      emailOfReceiveReport :any;
      profilePicture: any;
      updateForm = {}
      profileForm : FormGroup;
      
      token = 'bTxCvrFmoJmWf_NyzlgTfHhx8-PvNHYC';
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpClient: HttpClient,private fb: FormBuilder, private storage: Storage ) {
  //  console.log(ENV.BASE_URL);
    this.response = false;
    this.profileForm = fb.group({
      'email' : [null, Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{2,}@[a-zA-Z-_.]{2,}[.]{1}[a-zA-Z]{2,}')])],
      'department' : [],
      'nameOfReceiveReport' : [null, Validators.compose([Validators.required])],
      'emailOfReceiveReport' : [null, Validators.compose([Validators.required,])],
      'company' : [],
      'username' : [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._-]{2,}') ])],
      //'confirmPass': [null, Validators.compose([Validators.required, Validators.minLength(8) ])], 
    });


  }

  update(value: any):void{
    
    console.log(value.username);
    console.log(value.email);

    console.log(value.username);
    console.log(this.userid);
    console.log(this.token);
          



     const headers = new HttpHeaders({
      
      'Access-Control-Allow-Headers' : '*, access_token, user_id', 
      'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json',
      'user_id':this.userid, 
      'access_token':this.token,
      'Accept':'application/json',
     'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS'
       //     'user_id':'15'
     }
     );
     const req = this.httpClient.post(ENV.BASE_URL + 'users/'+this.userid, {
      userEmail: value.email,
      userName: value.username,
      userDepartment: value.department,
      userCompany: value.company,
      nameToReceiveReport   : value.nameOfReceiveReport,
      emailToReceiveReport:value.emailOfReceiveReport

    },
    {headers:headers})
    .subscribe(
      (res: any) => {
        console.log(res);
        // Initializing session information
        // this.storage.set('Session.user_name', res.data.userName);
        // this.storage.set('Session.user_id', res.data.userId);
        // this.storage.set('Session.access_token', res.data.token);
        // this.storage.set('Session.token_expiry', res.data.expiry);
        // this.storage.set('Session.profile_pic', res.data.profilePicture);
        // this.storage.set('Session.company_logo', res.data.companyLogo);
       // this.navCtrl.push(MainPage);
      },
      err => {
        this.response = true;
        console.log("Error occurred");
        console.log(err);
      }
    );	
    // this.user = this.httpClient.post(this.baseUrl+'users/'+this.userid,this.updateForm,{headers:headers});
		// this.user
		// .subscribe(data => {
    // //  console.log(headers.get('user_id'));
    //   console.log(this.token);
    //   //console.log('my data: ', data);
    //   console.log('user: ',data['data']);
    //   this.userData = data['data'];
    //   console.log('userId: ',this.userData['userId']);
    //   setTimeout(() => {
    //   //this.userName = this.userData['userName'];
    // }, 0);
    //  // this.dept = this.userData['userDepartment'];
    //   //this.nameOfReceiveReport = this.userData['nameToReceiveReport'];
    //   //this.emailOfReceiveReport = this.userData['emailToReceiveReport'];
    //   this.profilePicture = "http://clients3.5stardesigners.net/safetyapp/api/web/uploads/CompanyLogos/_abc.jpg";
		// })
    // console.log("Update clicked");
  }
  goBack(){
    this.navCtrl.pop();
  }


  ionViewDidLoad() {

    this.storage.get("Session.user_id").then((value1) => {
      
      this.userid = value1;
      
      //alert('User Id: '+ this.userid);  
       //resolve(value);
       //return this.userid;
     

     this.storage.get("Session.access_token").then((value2) => {
      
      this.token = value2;
      console.log(this.token);

     // console.log(ENV.BASE_URL);


    const headers = new HttpHeaders({
    
      'Access-Control-Allow-Headers' : '*, access_token, user_id', 
      'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json',
      'user_id':this.userid, 
      'access_token':this.token,
      'Accept':'application/json',
     'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS'
      //     'user_id':'15'
    }
    );
    console.log(this.userid);
        this.user = this.httpClient.get(this.baseUrl+'users/'+this.userid,{headers:headers});
        this.user
        .subscribe(data => {
        //  console.log(headers.get('user_id'));
          console.log(this.token);
          console.log('my data: ', data);
        //  console.log('user: ',data['data']);
          this.userData = data['data'];
          console.log('userId: ',this.userData['userId']);
          this.userName = this.userData['userName'];
          this.email  = this.userData['userEmail'];
          this.company = this.userData['userCompany'];
          this.dept = this.userData['userDepartment'];
          this.nameOfReceiveReport = this.userData['nameToReceiveReport'];
          this.emailOfReceiveReport = this.userData['emailToReceiveReport'];

          this.profilePicture = "http://clients3.5stardesigners.net/safetyapp/api/web/uploads/CompanyLogos/_abc.jpg";
        })
      })
    })
    console.log('ionViewDidLoad ProfilePage');
  }
 

}
