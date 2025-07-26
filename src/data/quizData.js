export const json = {
  "title": "Product Feedback",
  "pages": [
    {
      "name": "page1",
      "title": "Purchase Info",
      "elements": [
        {
          "type": "checkbox",
          "name": "question1",
          "title": "What did you try today?",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 1",
              "text": "Chunky Choco Walnut Cookie"
            },
            {
              "value": "Item 2",
              "text": "Chunky Cashew Coconut Cookie"
            },
            {
              "value": "Item 3",
              "text": "Chunky Mocha Almond Cookie"
            },
            {
              "value": "Item 4",
              "text": "Gluten Free Brownie"
            },
            {
              "value": "Item 5",
              "text": "Whole Wheat Almond Biscotti"
            },
            {
              "value": "Item 6",
              "text": "Whole Wheat Coffee Walnut Biscotti"
            },
            {
              "value": "Item 7",
              "text": "Gluten Free Chocolate Cookie Bar"
            },
            {
              "value": "Item 8",
              "text": "Honey Spiced Cashew"
            }
          ],
          "showSelectAllItem": true,
          "selectAllText": "Tried All"
        }
      ]
    },
    {
      "name": "page2",
      "title": "Future Interest",
      "elements": [
        {
          "type": "tagbox",
          "name": "question2",
          "title": "How likely are you to purchase from us again if we return?",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Less Likely"
            },
            {
              "value": "2",
              "text": "Likely"
            },
            {
              "value": "3",
              "text": "Very likely"
            }
          ],
          "searchEnabled": false,
          "hideSelectedItems": true
        },
        {
          "type": "tagbox",
          "name": "question3",
          "title": "Would you confidently recommend us to others",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Less Likely"
            },
            {
              "value": "2",
              "text": "Neutral"
            },
            {
              "value": "3",
              "text": "Definitely"
            }
          ],
          "searchEnabled": false,
          "hideSelectedItems": true
        }
      ]
    },
    {
      "name": "page3",
      "title": "About You (Optional)",
      "elements": [
        {
          "type": "dropdown",
          "name": "About You",
          "title": "Please select your age group:",
          "choices": [
            "<18",
            "18-25",
            "26-40",
            "41-60",
            "61+"
          ],
          "placeholder": "Click for Dropdown"
        },
        {
          "type": "tagbox",
          "name": "question4",
          "title": "Dietary preference",
          "choices": [
            {
              "value": "Item 1",
              "text": "Vegetarian"
            },
            {
              "value": "Item 2",
              "text": "Vegan"
            },
            {
              "value": "Item 3",
              "text": "Gluten-free"
            },
            {
              "value": "Item 4",
              "text": "No specific preference"
            }
          ],
          "searchEnabled": false,
          "hideSelectedItems": true
        }
      ]
    },
    {
      "name": "page4",
      "title": "Product Quality - II",
      "elements": [
        {
          "type": "tagbox",
          "name": "question5",
          "title": "The portion size felt just right for the price.",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Strongly Disagree"
            },
            {
              "value": "2",
              "text": "Disagree"
            },
            {
              "value": "3",
              "text": "Neutral"
            },
            {
              "value": "4",
              "text": "Agree"
            },
            {
              "value": "5",
              "text": "Strongly Agree"
            }
          ],
          "searchEnabled": false,
          "hideSelectedItems": true
        },
        {
          "type": "tagbox",
          "name": "question6",
          "title": "There was a good variety of flavors or items available.",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Strongly Disagree"
            },
            {
              "value": "2",
              "text": "Disagree"
            },
            {
              "value": "3",
              "text": "Neutral"
            },
            {
              "value": "4",
              "text": "Agree"
            },
            {
              "value": "5",
              "text": "Strongly Agree"
            }
          ],
          "searchEnabled": false,
          "hideSelectedItems": true
        }
      ]
    },
    {
      "name": "page5",
      "title": "Pricing & Value",
      "elements": [
        {
          "type": "tagbox",
          "name": "question7",
          "title": "How would you rate our overall value for money?",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Very Poor"
            },
            {
              "value": "2",
              "text": "Poor"
            },
            {
              "value": "3",
              "text": "Fair"
            },
            {
              "value": "4",
              "text": "Good"
            },
            {
              "value": "5",
              "text": "Excellent"
            }
          ],
          "searchEnabled": false,
          "hideSelectedItems": true
        },
        {
          "type": "tagbox",
          "name": "question8",
          "title": "Compared with similar baked goods you buy elsewhere, our prices feel:",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Expensive"
            },
            {
              "value": "2",
              "text": "Comparable"
            },
            {
              "value": "3",
              "text": "Economical"
            }
          ],
          "searchEnabled": false,
          "hideSelectedItems": true
        }
      ]
    },
    {
      "name": "page6",
      "title": "Suggestions",
      "elements": [
        {
          "type": "checkbox",
          "name": "question10",
          "title": " What is one thing we could improve?\n",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 2",
              "text": "Taste"
            },
            {
              "value": "Item 3",
              "text": "Freshness"
            },
            {
              "value": "Item 4",
              "text": "Variety"
            },
            {
              "value": "Item 5",
              "text": "Service"
            },
            {
              "value": "Item 6",
              "text": "Pricing"
            }
          ],
          "separateSpecialChoices": true,
          "showNoneItem": true,
          "noneText": "You are Good!",
          "selectAllText": ""
        }
      ]
    },
    {
      "name": "page7",
      "title": "Feedback",
      "elements": [
        {
          "type": "comment",
          "name": "question9",
          "title": "Share Your Valued Feedback"
        }
      ]
    },
    {
      "name": "page8",
      "title": "Product Quality - I",
      "elements": [
        {
          "type": "tagbox",
          "name": "question12",
          "title": "The taste of the item(s) I bought met or exceeded my expectations.",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Strongly Disagree"
            },
            {
              "value": "2",
              "text": "Disagree"
            },
            {
              "value": "3",
              "text": "Neutral"
            },
            {
              "value": "4",
              "text": "Agree"
            },
            {
              "value": "5",
              "text": "Strongly Agree"
            }
          ],
          "searchEnabled": false,
          "hideSelectedItems": true
        },
        {
          "type": "tagbox",
          "name": "question13",
          "title": "The freshness of the baked goods was evident.",
          "isRequired": true,
          "choices": [
            {
              "value": "1",
              "text": "Strongly Disagree"
            },
            {
              "value": "2",
              "text": "Disagree"
            },
            {
              "value": 3,
              "text": "Neutral"
            },
            {
              "value": "4",
              "text": "Agree"
            },
            {
              "value": "5",
              "text": "Strongly Agree"
            }
          ],
          "searchEnabled": false,
          "hideSelectedItems": true
        }
      ]
    },
    {
      "name": "Lucky Draw Entry",
      "title": "Lucky Draw Entry",
      "description": "Please provide your details below to enter our lucky draw. By doing so, you consent to the collection of your personal data, which we will use responsibly and solely for the purpose of this draw.",
      "elements": [
        {
          "type": "text",
          "name": "Please provide your details below to enter our lucky draw.",
          "title": "Name"
        },
        {
          "type": "text",
          "name": "Phone",
          "title": "Phone ",
          "inputType": "tel"
        },
        {
          "type": "text",
          "name": "question11",
          "title": "Email",
          "inputType": "email"
        }
      ]
    }
  ],
  "showProgressBar": true,
  "widthMode": "responsive"
}; 