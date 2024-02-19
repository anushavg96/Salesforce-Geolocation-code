public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunity() {
        List<Opportunity> opportunityList = new List<Opportunity>();
        opportunityList = [SELECT Id, Name,AccountId,Account.Name,Amount,CloseDate,Description,Type,StageName FROM Opportunity WITH SECURITY_ENFORCED LIMIT 100];
        return opportunityList;
    } 
}