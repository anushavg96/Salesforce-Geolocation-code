import { LightningElement , wire} from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class AccountList extends LightningElement {
    columns = [
        { label: 'Account Name', fieldName: 'linkName', type: 'url', typeAttributes: {label: { fieldName: 'Name' }, sortable: true ,target: '_blank'}},
        { label: 'Account Number', fieldName: 'AccountNumber', type: 'text', sortable: true },
        { label: 'Phone', fieldName: 'Phone', type: 'Phone',sortable: true  },
        { label: 'Billing Street', fieldName: 'BillingStreet', type: 'text',sortable: true  },
        { label: 'Billing City', fieldName: 'BillingCity', type: 'address',sortable: true  },
        { label: 'Billing State', fieldName: 'BillingState', type: 'address',sortable: true  },
        { label: 'Billing PostalCode', fieldName: 'BillingPostalCode', type: 'address',sortable: true  },
        { label: 'Billing Country', fieldName: 'BillingCountry', type: 'address',sortable: true  },
        { label: 'Account Type', fieldName: 'Type', type: 'picklist',sortable: true  },
        { label: 'Website', fieldName: 'Website', type: 'url', typeAttributes: {label: { fieldName: 'Website' },sortable: true  }},
    ];
    error;
    accList;
    rowOffset = 0;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;

    @wire(getAccounts) getaccountList({error,data}) {
        if(data) {
            this.accList = data.map(
                record => Object.assign(
                    {"linkName" : '/'+record.Id},
                    {"Website" : record.Website},
                    record
                ));
            //this.accList = data;
            this.error = undefined;
        } else if(error) {
            this.error = error;
            this.accList = undefined;
        }
    }
    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }
    onHandleSort(event) {
        debugger;
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.accList];
        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.accList = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}