const db = require('./dbconfig');

exports.getUser = (req, res, next) => {
  const { userid } = req.headers;

  db.query('SELECT * from userprofile INNER JOIN addressInformation ON userprofile.cognito_username = addressInformation.cognito_username where userprofile.cognito_username = $1', [userid], function (err, result) {
    if (err) {
      return res.status(500).json({
        error: err
      })
    }
    return res.status(200).send(result.rows);
  });
}

exports.updateUser = (req, res, next) => {
  const { userid } = req.headers;

  db.query('SELECT * from userprofile INNER JOIN addressInformation ON userprofile.cognito_username = addressInformation.cognito_username where userprofile.cognito_username = $1', [userid], function (err, result) {
    if (err) {
      return res.status(500).json({
        error: err
      })
    }
    let user = result.rows[0];
    user.additionalInformation = user.additionalInformation || {};
    user.userPreferences = user.userPreferences || {};
    let updatedUserInfo = req.body.userInfo;

    let savedAdditionalInformation = {
      'married': user.additionalInformation['familyStatus'] && user.additionalInformation['familyStatus']['married'] ? user.additionalInformation['familyStatus']['married'] : '',
      'kids': user.additionalInformation['familyStatus'] && user.additionalInformation['familyStatus']['kids'] ? user.additionalInformation['familyStatus']['kids'] : '',
      'type': user.additionalInformation['home'] && user.additionalInformation['home']['type'] ? user.additionalInformation['home']['type'] : '',
      'rent': user.additionalInformation['home'] && user.additionalInformation['home']['rent'] ? user.additionalInformation['home']['rent'] : '',
      'value': user.additionalInformation['home'] && user.additionalInformation['home']['value'] ? user.additionalInformation['home']['value'] : '',
      'mortgageDebt': user.additionalInformation['home'] && user.additionalInformation['home']['mortgageDebt'] ? user.additionalInformation['home']['mortgageDebt'] : '',
      'mortgageInterest': user.additionalInformation['home'] && user.additionalInformation['home']['mortgageInterest'] ? user.additionalInformation['home']['mortgageInterest'] : '',
      'mortgageType': user.additionalInformation['home'] && user.additionalInformation['home']['mortgageType'] ? user.additionalInformation['home']['mortgageType'] : '',
      'mortgageTerm': user.additionalInformation['home'] && user.additionalInformation['home']['mortgageTerm'] ? user.additionalInformation['home']['mortgageTerm'] : '',
      'status': user.additionalInformation['employement'] && user.additionalInformation['employement']['status'] ? user.additionalInformation['employement']['status'] : '',
      'income': user.additionalInformation['employement'] && user.additionalInformation['employement']['income'] ? user.additionalInformation['employement']['income'] : '',
      'own': user.additionalInformation['contribution'] && user.additionalInformation['contribution']['own'] ? user.additionalInformation['contribution']['own'] : '',
      'employer': user.additionalInformation['contribution'] && user.additionalInformation['contribution']['employer'] ? user.additionalInformation['contribution']['employer'] : '',
      'studentloanDebt': user.additionalInformation['debt'] && user.additionalInformation['debt']['studentloanDebt'] ? user.additionalInformation['debt']['studentloanDebt'] : '',
      'creditCardDebt': user.additionalInformation['debt'] && user.additionalInformation['debt']['creditCardDebt'] ? user.additionalInformation['debt']['creditCardDebt'] : '',
      'otherDebt': user.additionalInformation['debt'] && user.additionalInformation['debt']['otherDebt'] ? user.additionalInformation['debt']['otherDebt'] : '',
      'savedLivingExpenses': user.additionalInformation['savings'] && user.additionalInformation['savings']['savedLivingExpenses'] ? user.additionalInformation['savings']['savedLivingExpenses'] : '',
    }



    let additionalInformation = {
      'familyStatus': {
        'married': updatedUserInfo.areYouMarried || savedAdditionalInformation.married,
        'kids': updatedUserInfo.numberOfKids || savedAdditionalInformation.kids,
      },
      'home': {
        'type': updatedUserInfo.rentOrOwn || savedAdditionalInformation.type,
        'rent': updatedUserInfo.rent || savedAdditionalInformation.rent,
        'value': updatedUserInfo.valueOfHouse || savedAdditionalInformation.value,
        'mortgageDebt': updatedUserInfo.mortgageDebt || savedAdditionalInformation.mortgageDebt,
        'mortgageInterest': updatedUserInfo.mortgageInterestRate || savedAdditionalInformation.mortgageInterest,
        'mortgageType': updatedUserInfo.fixedOrAdjustable || savedAdditionalInformation.mortgageType,
        'mortgageTerm': updatedUserInfo.mortgageTerm || savedAdditionalInformation.mortgageTerm,
      },
      'employement' : {
        'status' : updatedUserInfo.areYouEmployed || savedAdditionalInformation.status,
        'income' : updatedUserInfo.annualIncome || savedAdditionalInformation.income
      },
      'contribution': {
        'own': updatedUserInfo.percentageContributionToRetirementPlan || savedAdditionalInformation.own,
        'employer': updatedUserInfo.PercentageToEmployerMatch || savedAdditionalInformation.employer
      },
      'debt': {
        'studentLoanDebt': updatedUserInfo.studentLoanDebt || savedAdditionalInformation.studentloanDebt,
        'creditCardDebt': updatedUserInfo.creditCardDebt || savedAdditionalInformation.creditCardDebt,
        'otherDebt': updatedUserInfo.otherDebt || savedAdditionalInformation.otherDebt,
      },
      'savings': {
        'savedLivingExpenses': updatedUserInfo.livingExpenses || savedAdditionalInformation.savedLivingExpenses,
      }

    };

    let userPreferences = {
      'accountInfo': updatedUserInfo.accountInfo || user.userPreferences.accountInfo,
      'newsLetters': updatedUserInfo.newsLetters || user.userPreferences.newsLetters,
      'secureLogin': updatedUserInfo.secureLogin || user.userPreferences.secureLogin,
      'newFeatures': updatedUserInfo.newFeatures || user.userPreferences.newFeatures,
      'betaPrograms': updatedUserInfo.betaPrograms || user.userPreferences.betaPrograms,
    };



    let userProfileUpdateStatement = 'UPDATE userprofile SET user_preferences = $1, additional_information = $2, email = $3 , phone = $4, last_name = $5, first_name = $6, middle_name = $7,  date_of_birth = $8, age = $9, retirement_age = $10 WHERE cognito_username = $11';

    db.query(userProfileUpdateStatement, [userPreferences, additionalInformation, updatedUserInfo.emailAddress || user.email, updatedUserInfo.mobileNumber || user.phone
      , updatedUserInfo.lastName || user['last_name'], updatedUserInfo.firstName || user['first_name'], updatedUserInfo.middleName || user['middle_name']
      , updatedUserInfo.dateOfBirth || user['date_of_birth'], updatedUserInfo.age || user.age, updatedUserInfo.retirementAge || user['retirement_age'], userid], function (error, result) {
        if (error) {
          return res.status(500).json({
            error
          });
        }
        db.query('SELECT * from addressInformation WHERE cognito_username = $1', [userid], function (err, result) {
          if (err) {
            return res.status(500).json({
              error: err
            })
          }

          let savedAddressInformation = result.rows[0];

          let addressInformationUpdateStatement = 'UPDATE addressInformation SET address1 = $1, address2 = $2, city = $3, stateName = $4, zipcode = $5 WHERE cognito_username = $6';

          db.query(addressInformationUpdateStatement, [updatedUserInfo.streetAddress || savedAddressInformation.address1, updatedUserInfo.suitAddress || savedAddressInformation.address2,
          updatedUserInfo.city || savedAddressInformation.city, updatedUserInfo.state || savedAddressInformation.stateName, updatedUserInfo.zipCode || savedAddressInformation.zipcode, userid
          ], (error, result) => {
            if (error) {
              return res.status(500).json({
                error
              });
            }
            return res.status(200).json({
              message: 'information updated successfully'
            });
          });
        });
      });
  });
}