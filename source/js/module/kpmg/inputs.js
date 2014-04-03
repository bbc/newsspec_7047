define({
    weeklyConsumption: {
        beer: {
            name: "Beer",
            quantity: 0,
            dutyName: "beer",
            dutyGroup: "alcohol",
            validation: [{ propertyName: "quantity", dataType: "positivenumber"}]
        },

        wine: {
            name: "Wine",
            quantity: 0,
            dutyName: "wine",
            dutyGroup: "alcohol",
            validation: [{ propertyName: "quantity", dataType: "positivenumber"}]
        },

        spirits: {
            name: "Spirits",
            quantity: 0,
            dutyName: "spirits",
            dutyGroup: "alcohol",
            validation: [{ propertyName: "quantity", dataType: "positivenumber"}]
        },

        cigarettes: {
            name: "Tobacco",
            quantity: 0,
            dutyName: "tobacco",
            dutyGroup: "tobacco",
            validation: [{ propertyName: "quantity", dataType: "positivenumber"}]
        },

        vehicleFuel: [],
        cars: []
    },

    person: {
        gender: {
            type: null,
            validTypes: [{ name: "male", display: "Male" }, { name: "female", display: "Female"}],
            validation: [{ propertyName: "type", dataType: "string"}]
        },

        ageInYears: 0,

        averageWeeklyWorkingHours: 0,

        children: 0,

        validation: [{ propertyName: "ageInYears", dataType: "positiveWholeNumber" },
                     { propertyName: "averageWeeklyWorkingHours", dataType: "positivenumber" },
                     { propertyName: "children", dataType: "positiveWholeNumber" }
        ],

        maritalStatus: {
            type: null,
            validTypes: [{ name: "single", display: "Single" }, { name: "married", display: "Married" }, { name: "civilpartnership", display: "Civil Partnership" }, { name: "cohabiting", display: "Cohabiting" }, { name: "divorced", display: "Divorced"}],
            validation: [{ propertyName: "type", dataType: "string"}]
        },

        income: {
            salary: 0,
            selfEmployment: 0,
            netDividends: 0,
            netInterest: 0,
            rental: 0,
            nonStatePension: 0,
            validation: [{ propertyName: "salary", dataType: "positivenumber" },
                         { propertyName: "selfEmployment", dataType: "positivenumber" },
                         { propertyName: "netDividends", dataType: "positivenumber" },
                         { propertyName: "netInterest", dataType: "positivenumber" },
                         { propertyName: "rental", dataType: "positivenumber" },
                         { propertyName: "nonStatePension", dataType: "positivenumber" }
            ]
        },

        companyCars: [{
            listPrice: 0,
            co2Emissions: 0,
            isDiesel: false,
            fuelProvided: false,
            validation: [{ propertyName: "listPrice", dataType: "positivenumber" },
                         { propertyName: "co2Emissions", dataType: "positivenumber" }
            ]
        }],

        companyVans: [{
            privateUsePermitted: false,
            fuelProvided: false
        }]

    },

    includePartner: false,

    spouse: {
        gender: {
            name: "Gender",
            type: null,
            validTypes: [{ name: "male", display: "Male" }, { name: "female", display: "Female"}],
            validation: [{ propertyName: "type", dataType: "string"}]
        },

        ageInYears: 0,

        averageWeeklyWorkingHours: 0,

        validation: [{ propertyName: "ageInYears", dataType: "positiveWholeNumber" },
                      { propertyName: "averageWeeklyWorkingHours", dataType: "positivenumber" }
        ],

        income: {
            salary: 0,
            selfEmployment: 0,
            netDividends: 0,
            netInterest: 0,
            rental: 0,
            nonStatePension: 0,
            validation: [{ propertyName: "salary", dataType: "positivenumber" },
                         { propertyName: "selfEmployment", dataType: "positivenumber" },
                         { propertyName: "netDividends", dataType: "positivenumber" },
                         { propertyName: "rental", dataType: "positivenumber" },
                         { propertyName: "nonStatePension", dataType: "positivenumber" }
            ]
        },

        companyCars: [{
            listPrice: 0,
            co2Emissions: 0,
            isDiesel: false,
            fuelProvided: false,
            validation: [{ propertyName: "listPrice", dataType: "positivenumber" },
                         { propertyName: "co2Emissions", dataType: "positivenumber" }
            ]
        }],

        companyVans: [{
            privateUsePermitted: false,
            fuelProvided: false
        }]
    }
});
