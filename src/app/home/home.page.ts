import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonCard, IonCardContent,
  IonSpinner, IonFooter
} from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { QrService } from '../services/qr';
import { OcrService } from '../services/ocr';
import { addIcons } from 'ionicons';
import { cameraOutline, sendOutline, checkmarkCircle, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormlyModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonCard, IonCardContent,
    IonSpinner, IonFooter
  ],
})
export class HomePage implements OnInit {
  form = new FormGroup({});
  model: any = {
    vehicleId: '',
    fuelType: '',
    liters: 0,
    date: new Date().toISOString(),
    photoTimestamp: null
  };

  fields: FormlyFieldConfig[] = [
    {
      key: 'vehicleId',
      type: 'input',
      templateOptions: {
        label: 'ID Vehicul/Utilaj',
        placeholder: 'Scanează QR sau introdu manual',
        required: true,
        readonly: true,
      },
    },
    {
      key: 'fuelType',
      type: 'input',
      templateOptions: {
        label: 'Tip Combustibil',
        placeholder: 'Ex: Motorină, Benzină',
        readonly: true,
      },
    },
    {
      key: 'liters',
      type: 'input',
      templateOptions: {
        label: 'Litri',
        placeholder: '0.00',
        type: 'number',
        required: true,
      },
    }
  ];

  isProcessing = false;

  constructor(
    private qrService: QrService,
    private ocrService: OcrService
  ) {
    addIcons({ cameraOutline, sendOutline, checkmarkCircle, timeOutline });
  }

  ngOnInit() {
    const data = this.qrService.getVehicleData();
    if (data.vehicleId) {
      this.model = { ...this.model, ...data };
    }
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (image.dataUrl) {
        this.isProcessing = true;
        this.model.photoTimestamp = new Date().toISOString();
        const result = await this.ocrService.recognizePumpData(image.dataUrl);
        this.model = {
          ...this.model,
          liters: result.liters || this.model.liters
        };
        // Update form model reference to trigger Formly detection if needed
        this.model = { ...this.model };
        this.isProcessing = false;
      }
    } catch (error) {
      console.error('Camera error', error);
      this.isProcessing = false;
    }
  }

  submit() {
    if (this.form.valid) {
      console.log('Fuel Entry Submitted:', this.model);
      // In a real app, send to API
      alert('Alimentare Înregistrată cu Succes!');
    }
  }
}
