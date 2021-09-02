import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DatePicker } from '@ionic-native/date-picker';



import { CategoryDaoProvider } from '../../providers/category-dao/category-dao';
import { AccountProvider } from '../../providers/account/account';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-new-entry',
  templateUrl: 'new-entry.html',
})
export class NewEntryPage {
  categories = [];
  currentBalance = 0;
  entryForm: FormGroup;
  entry = {}

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
    public camera: Camera,
    public datePicker: DatePicker,
    public account: AccountProvider,
    public categoryDao: CategoryDaoProvider,
    private builder: FormBuilder) {

    this.entryForm = builder.group({
      amount: new FormControl('', Validators.required),
      category_id: new FormControl('', Validators.required),
    });
  }

  ionViewDidLoad() {
    const entryId = this.navParams.get('entryId');
    console.log('new-entry: entry ID - ', entryId);

    this.loadData(entryId);
    this.loadBalance();
  }

  submitForm() {
    console.log('Enviando dados..');
    console.log(JSON.stringify(this.entry));
    this.insertBD();
    this.navCtrl.pop();
  }

  dismiss() {
    console.log('report: dismiss...');
    this.navCtrl.pop();
  }

  goBack() {
    console.log('Cancelando...');
    this.navCtrl.pop();
  }

  insertBD() {
    const amount = this.entry['amount'];
    const categoryid = this.entry['category_id'];
    const latitude = this.entry['latitude'];
    const longitude = this.entry['longitude'];
    const address = this.entry['address'];
    const image = this.entry['image'];
    const description = this.entry['description'];
    const entryAt = this.entry['entry_at'];

    this.account
      .addEntry(amount,categoryid, description, entryAt, latitude, longitude, address, image)
      .then(() => console.log('registro inserido'));
  }

  loadData(entryId = null) {
    if (entryId > 0){
      this.loadEntry(entryId);
    }

    this.loadBalance();
    this.loadCategories();

    loadEntry(entryId) {
      
    }
    this.categoryDao
      .getAll()
      .then((data: any[]) => this.categories = data);
  }

  loadBalance() {
    this.currentBalance = this.account.currentBalance();
  }

  loadCategories() {
    this.categoryDao
      .getAll()
      .then((data: any[]) => this.categories = data);
  }

  openCameraModal() {
    const options: CameraOptions = {
      quality: 50,
      correctOrientation: true,
      allowEdit: true,
      saveToPhotoAlbum: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options)
      .then((imageData) => {
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        console.log('new-entry: camera file - ', base64Image);
        this.entry['image'] = base64Image;

      }).catch((error) => {
        console.log('new-entry: error camera - ', JSON.stringify(error));

        let alert = this.alertCtrl.create({
          title: 'Erro de câmera',
          subTitle: 'Houve um erro ao ligar a câmera, por favor, certifique-se que a câmera está habilitada e com permissão.',
          buttons: ['Ok']
        });
        alert.present();
      });

  }

  openGeoLocationModal() {
    console.log('new-entry: openGeoLocationModal');

    let loading = this.loadingCtrl.create({
      content: 'Aguarde...'
    });
    loading.present();

    let geoCodeOptions: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };

    this.geolocation.getCurrentPosition()
      .then((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log('new-entry: geocoords ', `${latitude} - ${longitude}`);

        this.nativeGeocoder.reverseGeocode(latitude, longitude, geoCodeOptions)
          .then((geoCodeResult: NativeGeocoderReverseResult[]) => {
            loading.dismiss();
            console.log('new-entry: reversegeo ', JSON.stringify(geoCodeResult[0]));

            if (geoCodeResult.length > 0) {
              const locality = geoCodeResult[0].locality;
              const address = geoCodeResult[0].thoroughfare;
              const number = geoCodeResult[0].subThoroughfare;
              let completeAddress = `${address}, ${number} - ${locality}`;

              let alert = this.alertCtrl.create({
                title: 'Usar esta localização?',
                cssClass: 'custom-alert',
                subTitle: completeAddress
              });
              alert.addButton('Não');
              alert.addButton({
                text: 'Sim',
                handler: () => {
                  this.entry['latitude'] = latitude;
                  this.entry['longitude'] = longitude;
                  this.entry['address'] = completeAddress;
              }});
              alert.present();
            } else {
              let alert = this.alertCtrl.create({
                title: 'Erro de localização',
                cssClass: 'custom-alert',
                subTitle: 'Não foi possível encontrar o endereço desta localização.',
                buttons: ['Ok']
              });
              alert.present();
            }

          })
          .catch((error: any) => {
            console.log('new-entry: error getting geocoding - ', error.message);
            loading.dismiss();

            let alert = this.alertCtrl.create({
              title: 'Erro de localização',
              subTitle: 'Houve um erro ao capturar o endereço da localização, por favor, certifique-se que a localização está habilitada.',
              buttons: ['Ok']
            });
            alert.present();
          });

      }).catch((error) => {
        console.log('new-entry: error getting location - ', error.message);

        loading.dismiss();

        let alert = this.alertCtrl.create({
          title: 'Erro de localização',
          subTitle: 'Houve um erro ao capturar a localização, por favor, certifique-se que a localização está habilitada e com permissão.',
          buttons: ['Ok']
        });
        alert.present();
      });
  }

  openDescriptionModal() {
    const prompt = this.alertCtrl.create({
      title: 'Descrição'
    });
    prompt.addInput({
      name: 'description',
      placeholder: '',
      value: this.entry['description']
    });
    prompt.addButton('Cancelar');
    prompt.addButton({
      text: 'Ok',
      handler: (data) => {
        console.log('new-entry: description - ', data['description']);
        this.entry['description'] = data['description'];
      }
    });
    prompt.present();
  }

  openDateModal(){
      this.datePicker.show({
        date: this.entry['entry_at'] ? new Date(this.entry['entry_at']) : new Date(),
        mode: 'datetime',
        titleText: 'Selecione uma data',
        okText: 'Ok',
        cancelText: 'Cancelar',
        todayText: 'Hoje',
        nowText: 'Agora',
        locale: 'pt_BR',
        is24Hour: true,
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
      }).then(date => {
        console.log('new-entry: date - ', date);
        this.entry['entry_at'] = date;
        }
      ),
      error => console.log('new-entry: error on got date - ', JSON.stringify(error))
  }
}
