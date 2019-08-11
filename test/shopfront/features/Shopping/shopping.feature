Feature: Shopping Feature
 
  Scenario: Log in Vintage shop
    Given I open "vintage" shop
    When I do login with email "vintage@evizi.com" and password "123456"
    Then I should see login modal disappear
    When I click logout
    Then I should see login modal appear
