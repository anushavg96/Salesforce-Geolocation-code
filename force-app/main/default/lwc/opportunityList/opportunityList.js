import { LightningElement, wire } from 'lwc';
import getOpportunity from '@salesforce/apex/OpportunityController.getOpportunity';
export default class OpportunityList extends LightningElement {
    columns = [
        { label: 'Name', fieldName: 'linkName', type: 'url', typeAttributes: {label: { fieldName: 'Name' }, sortable: true ,target: '_blank'}},
        { label: 'Account Name', fieldName: 'accountLink', type: 'url', typeAttributes: {label: { fieldName: 'Account.Name' }, sortable: true ,target: '_blank'}},
        { label: 'Amount', fieldName: 'Amount', type: 'currency',sortable: true  },
        { label: 'Description', fieldName: 'Description', type: 'text',sortable: true  },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date',sortable: true  },
        { label: 'Stage Name', fieldName: 'StageName', type: 'picklist',sortable: true  },
        { label: 'Account Type', fieldName: 'Type', type: 'picklist',sortable: true  },
    ];
    error;
    oppList;
    rowOffset = 0;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;
    
    @wire(getOpportunity) getopportunityList({error,data}) {
        if(data) {
            this.oppList =  data.map(
            record => Object.assign(

                { "Account.Name": record.Account.Name},
                {"linkName" : '/'+record.Id},
                {"accountLink" : '/'+record.AccountId},
                record
            ));
            //this.oppList = data;
            this.error = undefined;
        } else if(error) {
            this.error = error;
            this.oppList = undefined;
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
        const cloneData = [...this.oppList];
        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.oppList = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}