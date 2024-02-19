public with sharing class DistanceCalCoontroller {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getLocation(String recordId){
        Opportunity OpportunityObj = new Opportunity();
        OpportunityObj =[Select Id,Name,Location__c From Opportunity Where Id=:recordId and Location__Latitude__s != null and Location__Longitude__s != null  ];
        if(OpportunityObj != null) {
            List<Account> accountList = new List<Account>();
        accountList = [SELECT Id, Name,BillingLatitude, BillingLongitude, BillingAddress FROM Account
                                  Where BillingLatitude != null And BillingLongitude != null And
                                  DISTANCE(BillingAddress, :OpportunityObj.Location__c, 'km')< 51
                                  ORDER BY DISTANCE(BillingAddress, :OpportunityObj.Location__c, 'km')
                                  Limit 5];
        system.debug(accountList);
        return accountList;
    } else {
        return null;
    }
}
}