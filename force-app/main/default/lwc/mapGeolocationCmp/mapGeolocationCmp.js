import { LightningElement, api, wire, track } from 'lwc';
import { updateRecord } from "lightning/uiRecordApi";
import returnCordinate from '@salesforce/apex/DistanceCalCoontroller.getLocation';
//import { getRecord, getFieldValue } from "lightning/uiRecordApi";


export default class mapGeolocationCmp extends LightningElement {
    @api recordId;
    @track error;
    @track mapMarkers = [];
    @track markersTitle = 'Nearest 5';
    currentMarkerValue;
     

    @wire(returnCordinate, { recordId: '$recordId' })
    wiredAccountLocations({ error, data }) {
        if (data) {
            data.forEach(dataItem => {
                console.log(JSON.stringify(dataItem));
                this.mapMarkers = [
                    ...this.mapMarkers,
                    {
                        location: {
                            Latitude: dataItem.BillingLatitude,
                            Longitude: dataItem.BillingLongitude,
                        },
                        icon: 'standard:account',
                        title: dataItem.Name,
                        value: dataItem.Id,
                        description:  dataItem.BillingAddress.street+ " "+dataItem.BillingAddress.postalCode+ " "+dataItem.BillingAddress.city+ " "+dataItem.BillingAddress.state
                    },
                ];
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    handleMarkerSelect(event) {
       console.log('Selected Account  ' + event.target.selectedMarkerValue);
       const fields = {};
      fields['Id'] = this.recordId;
      fields['AccountId'] = event.target.selectedMarkerValue;

      const recordInput = { fields };

      updateRecord(recordInput)
        .then(() => {
            this.showMap=false;
        })
        .catch(()=>{
            this.showMap = true;
        })
    }
   
}