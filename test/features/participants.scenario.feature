Feature: Participants

Scenario: GET participants/{Type}/{ID} request
  Given als-msisdn-oracle-svc server
  When an ALS requests a valid GET /participants/{Type}/{ID} request
  Then I respond with a 200 OK

Scenario: POST participants/{Type}/{ID} request
  Given als-msisdn-oracle-svc server
  When an ALS requests a valid POST /participants/{Type}/{ID} request
  Then I respond with a 201 Created

Scenario: PUT participants/{Type}/{ID} request
  Given als-msisdn-oracle-svc server
  When an ALS requests a valid PUT /participants/{Type}/{ID} request
  Then I respond with a 200 OK

Scenario: DELETE participants/{Type}/{ID} request
  Given als-msisdn-oracle-svc server
  When an ALS requests a valid DELETE /participants/{Type}/{ID} request
  Then I respond with a 204 No Content
