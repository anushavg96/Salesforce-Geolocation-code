public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        List<Account> accountList = new List<Account>();
        accountList = [SELECT Id, Name,AccountNumber,BillingStreet,BillingCity,BillingState,BillingPostalCode,BillingCountry,Type, Phone,Website FROM Account WITH SECURITY_ENFORCED LIMIT 100];
        return accountList;
    }
}