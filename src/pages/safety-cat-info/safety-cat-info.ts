import { Network } from '@ionic-native/network';
import { ChiefSfetyApiProvider } from './../../providers/chief-sfety-api/chief-sfety-api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { InformationPage } from '../information/information';
import { PreviousPage } from '../previous/previous';
import { RemarksPage } from '../remarks/remarks';
import { OwnSubCatPage } from '../own-sub-cat/own-sub-cat';
import { SafetyPage } from '../safety/safety';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { AlertController } from 'ionic-angular';


@Component({
	selector: 'page-safety-cat-info',
	templateUrl: 'safety-cat-info.html',
	providers: [ChiefSfetyApiProvider]
})

export class SafetyCatInfoPage {
	categoryId: any;
	categoryName: any;
	inspection_desc: any;
	equipment_image: any;
	userid: any;
	user: any;
	token: string;
	sub_category: any;
	subCategories = [];
	checkedList = [];
	filter: any;
	allQuestions: any;
	selectedAnswers: any;
	response: any;
	subCategoriesCopy = [];
	subcategoryForm: FormGroup;
	collections: any;
	specific_cat : any;
	networkStatus :boolean;
	subcategoryinfo = [];
	constructor(
		private network : Network,
		public loadCtrl: LoadingController,
		private alertCtrl: AlertController,
		public navCtrl: NavController,
		public navParams: NavParams,
		private httpClient: HttpClient,
		private fb: FormBuilder,
		private storage: Storage,
		private ChiefSfetyApiProvider: ChiefSfetyApiProvider) {
		storage.get('Session.access_token').then((access_token) => {
			this.token = access_token;
		});
		storage.get('Session.user_id').then((user_id) => {
			this.userid = user_id;
		});
		
		this.categoryId = navParams.get('categoryId');
		this.categoryName = navParams.get('category_name');
		this.inspection_desc = navParams.get('inspection_desc');
		this.equipment_image = navParams.get('equipment_image');
		if (navParams.get('subCategories')) this.checkedList = JSON.parse(navParams.get('subCategories'));
		if (navParams.get('allQuestions')) this.allQuestions = JSON.parse(navParams.get('allQuestions'));
		console.log(this.specific_cat);

		//Pass values check
		console.log('page> safety-cat-info.ts (3rd step)');
		console.log('inspection_desc>' + this.inspection_desc);
		console.log('equipment_image>' + this.equipment_image);
		console.log('categoryId>' + this.categoryId);
		console.log('category_name>' + this.categoryName);
		console.log('checkedList>', this.checkedList);
		console.log('allQuestions>', this.allQuestions);

		this.subcategoryForm = this.fb.group({});
	}

	//Main Navigation links
	profileLoad = function () {
		this.navCtrl.push(ProfilePage)
	}

	previousLoad = function () {
		this.navCtrl.push(PreviousPage)
	}

	informationLoad = function () {
		this.navCtrl.push(InformationPage)
	}

	goBack() {
		this.navCtrl.push(SafetyPage, {
			inspection_desc: this.inspection_desc,
			equipment_image: this.equipment_image,
			categoryId: this.categoryId,
			category_name: this.categoryName
		})
	}

	OwnCatLoad = function () {
		this.navCtrl.push(OwnSubCatPage, {
			inspection_desc: this.inspection_desc,
			equipment_image: this.equipment_image,
			categoryId: this.categoryId,
			category_name: this.categoryName,
			action: "add"
		}).then(() => {
			const index = this.navCtrl.getActive().index;
			this.navCtrl.remove(0, index);
		});
	}
	editSubCategory(subcategory: any) {
		console.log("edit clicked" + subcategory.sub_category_id);
		const headers = new HttpHeaders()
			.set("user_id", this.userid.toString())
			.set("access_token", this.token);

		this.ChiefSfetyApiProvider.editSubCatregories(this.categoryId, subcategory.sub_category_id, headers).subscribe((collection_data: any) => {
			console.log("New Collection");
			console.log(collection_data.data.userSubCategories[0]);
			this.navCtrl.push(OwnSubCatPage, {
				inspection_desc: this.inspection_desc,
				equipment_image: this.equipment_image,
				categoryId: this.categoryId,
				category_name: this.categoryName,
				subcategoryinfo: collection_data.data.userSubCategories[0],
				action: "edit"
			}).then(() => {
				const index = this.navCtrl.getActive().index;
				this.navCtrl.remove(0, index);
			});
		}),
			err => {
				console.log("Error occurred");
				console.log(err);
			}
	}

	ionViewDidLoad() {
		
		this.specific_cat = this.navParams.get('specific_cat');
		if(this.specific_cat == undefined){
				this.storage.get('Session.Offline.specificCat').then(specific_cat => {
					this.specific_cat = specific_cat
				})
		}
		if(this.network.type == 'none' || this.network.type == 'unknown' ){
			this.networkStatus = false;
			console.log("connection off "+this.network.type);
		  }
		  else{
			this.networkStatus = true;
		  }
		  console.log("connection on "+this.network.type);
		 
			if(this.networkStatus == true){

			}else{

			}
		const loadCtrlStart = this.loadCtrl.create({
			content: 'Please wait ...'
		})
		loadCtrlStart.present();
		console.log('ionViewDidLoad');
		this.storage.get("Session.access_token").then((access_token) => {
			this.token = access_token;
			console.log(this.token + this.userid);
			const headers = new HttpHeaders()
				.set("user_id", this.userid.toString())
				.set("access_token", this.token);
			this.ChiefSfetyApiProvider.getEquipSubCategories(this.categoryId, headers).subscribe((data: any) => {
				loadCtrlStart.dismiss();
				console.log('Youa ')
				console.log("Length" + data.data.length);
				console.log(`actual data sub Category ${data}`);
				if (data.data && typeof data.data === 'object' && data.data.constructor === Array) {
					for (var i = 0; i < data.data.length; i++) {
						this.subCategories.push(
							{
								sub_category_id: data.data[i].equipmentSubCategoryId,
								sub_category_name: data.data[i].equipmentSubCategoryName,
							});
					}
					this.subCategoriesCopy = Object.assign([], this.subCategories);
				}
			}, err => {
				loadCtrlStart.dismiss();
				console.log(this.specific_cat);
				console.log("Length" + this.specific_cat);
				console.log(`actual data sub Category ${this.specific_cat.subcategory}`);
				if (this.specific_cat.subcategory && typeof this.specific_cat.subcategory === 'object' && this.specific_cat.subcategory.constructor === Array) {
					for (var i = 0; i < this.specific_cat.subcategory.length; i++) {
						console.log( this.specific_cat.subcategory[i].questions);	
						this.subCategories.push(	
							{
								sub_category_id: this.specific_cat.subcategory[i].subcategoryId,
								sub_category_name: this.specific_cat.subcategory[i].subcategoryName,
								questions : this.specific_cat.subcategory[i].questions,
							});
					}
					this.subCategoriesCopy = Object.assign([], this.subCategories);
				}
			
			})
		})
		console.log(this.subCategories);
		console.log('ionViewDidLoad SafetyCatInfoPage');
	}

	clickSelectBox(subcategory: any) {
		console.log(subcategory);
	
		const foundAt = this.checkedList.indexOf(subcategory.sub_category_id);
		if (foundAt >= 0) {
			this.checkedList.splice(foundAt, 1);
		}
		else {
			this.checkedList.push(subcategory.sub_category_id);
		}
		console.log(this.checkedList);
		console.log(JSON.stringify(this.checkedList));
		
		const foundAtsub = this.subcategoryinfo.indexOf(subcategory);
		if (foundAtsub >= 0) {
			this.subcategoryinfo.splice(foundAtsub, 1);
		}
		else {
			this.subcategoryinfo.push(subcategory);
		}
	
		console.log(this.subcategoryinfo);
		


	}

	list(value: any): void {
		console.log(value);
		console.log(this.checkedList);
		console.log(this.specific_cat);
		console.log(this.subcategoryinfo);
		this.navCtrl.push(RemarksPage, {
			specific_cat : this.specific_cat,
			questions: this.subcategoryinfo,
			categoryId: this.categoryId,
			category_name: this.categoryName,
			inspection_desc: this.inspection_desc,
			equipment_image: this.equipment_image,
			subCategories: JSON.stringify(this.checkedList),
			allQuestions: JSON.stringify(this.allQuestions)
		}).then(() => {
			const index = this.navCtrl.getActive().index;
			this.navCtrl.remove(0, index);
		});
	}

	filterSubCategories(): void {
		console.log('filterSubCategories>' + this.filter);

		let val: string = this.filter;

		//set default every time
		this.subCategories = this.subCategoriesCopy

		if (val.trim() == '') {
			this.subCategories = this.subCategoriesCopy;
		}
		else {
			this.subCategories = this.subCategories.filter((item) => {
				return item.sub_category_name.toLowerCase().indexOf(val.toLowerCase()) > -1;
			})
		}
	}

	check(subcat_id: any) {
		let result: any;
		result = this.checkedList.indexOf(subcat_id);
		if (result !== -1) {
			return true;
		}
		return false;
	}
	deleteSubCat(value: string) {
		let alert = this.alertCtrl.create({
			title: 'Confirm delete sub category',
			message: 'Are you sure you want to permanently delete this sub category alongwith its data?',
			buttons: [
				{
					text: 'No',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Yes',
					handler: () => {
						console.log('Delete clicked ' + value + " " + this.categoryId);
						const headers = new HttpHeaders()
							.set("user_id", this.userid.toString())
							.set("access_token", this.token);
						this.ChiefSfetyApiProvider.delEqipmentSubCategories(this.categoryId, value, headers).subscribe(data => {

							console.log(data);
							this.navCtrl.push(SafetyCatInfoPage, {
								categoryId: this.categoryId,
								category_name: this.categoryName,
								inspection_desc: this.inspection_desc,
								equipment_image: this.equipment_image
							}).then(() => {
								const index = this.navCtrl.getActive().index;
								this.navCtrl.remove(0, index);
							});
						}),
							err => {
								console.log("Error occurred");
								console.log(err);
							}

					}
				}
			]
		});
		alert.present();




	}

}