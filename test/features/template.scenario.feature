Feature: als-msisdn-oracle-svc server

Scenario: Health Check
  Given als-msisdn-oracle-svc server
  When I get 'Health Check' response
  Then The status should be 'OK'
