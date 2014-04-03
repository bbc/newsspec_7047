
define(function () {

    var NIBandLimits = {
        lowerBandAmount: 5772,
        thresholdLimit: 2184,
        upperBandAmount: 33909,
        class4Rate: 9,
        HigherRateofClass4and1: 2
    }

    var obj = {
        DUTIES: {
            tobacco: {
                rate: 6.0800,
                periodsPerYear: 52
            },
            beer: {
                rate: 0.9093,
                periodsPerYear: 52
            },
            wine: {
                rate: 0.7373,
                periodsPerYear: 52
            },
            spirits: {
                rate: 0.7947,
                periodsPerYear: 52
            },

            fuel_unleaded: {
                rate: 0.7950,
                periodsPerYear: 52
            },
            fuel_diesel: {
                rate: 0.8068,
                periodsPerYear: 52
            },
            fuel_lpg: {
                rate: 0.3383,
                periodsPerYear: 52
            },

            price_unleaded: {
                rate: 1.293
            },
            price_diesel: {
                rate: 1.364
            },
            price_lpg: {
                rate: 0.701
            },

            vehicleDuty_nocar: {
                rate: 0,
                periodsPerYear: 1
            },
            vehicleDuty_low: {
                rate: 15,
                periodsPerYear: 1
            },
            vehicleDuty_medium: {
                rate: 140,
                periodsPerYear: 1
            },
            vehicleDuty_high: {
                rate: 245,
                periodsPerYear: 1
            },
            vehicleDuty_veryhigh: {
                rate: 495,
                periodsPerYear: 1
            }
        },

        CHILDBENEFITS: {
            eldestChildRate: 20.50,
            otherChildRate: 13.55,
            incomeThreshold: 50000,
            weeksTobeChargedAtNewRule: 52,
            weeksInYear: 52
        },

        STATEPENSIONS: {

            qualifyingAgeMale: 65,
            qualifyingAgeFemale: 62,

            pensionSingle: 5881.20,
            pensionMarried: 3525.60,

            pensionExtra: 13.00,
            pensionExtraAge: 80
        },

        COMPANYCAR: {
            minBenefitPercentage: 11, //percentage
            maxBenefitPercentage: 35, //percentage
            dieselSurcharge: 3, //percentage
            carFuelBenefit: 21100,
            band: [{ co2Min: 1, co2Max: 75, percentageStart: 5, stepSize: 1, stepPercentageIncrease: 0 },
                   { co2Min: 76, co2Max: 94, percentageStart: 11, stepSize: 1, stepPercentageIncrease: 0 },
                   { co2Min: 95, co2Max: Infinity, percentageStart: 12, stepSize: 5, stepPercentageIncrease: 1}]

        },

        COMPANYVAN: {
            vanBenefit: 3090,
            vanFuelBenefit: 581
        },

        NI: {
            minimumNIAge: 16,
            niUpperLimit: NIBandLimits.lowerBandAmount + NIBandLimits.thresholdLimit + NIBandLimits.upperBandAmount,
            niLowerLimit: NIBandLimits.lowerBandAmount + NIBandLimits.thresholdLimit,
            niMaxClass1and2Limit: 4146.72,
            class4Rate: 9,
            HigherRateofClass4and1: 2,
            class2WeeklyLimit: 2.75,
            noOf52WeeksInYear: 52,
            noOf53WeeksInYear: 53,

            class1_bands: [{ amount: NIBandLimits.lowerBandAmount, rate: 0, name: "at0_class1" },
                            { amount: NIBandLimits.thresholdLimit, rate: 0, name: "atThreshold_class1" },
                            { amount: NIBandLimits.upperBandAmount, rate: 12, name: "at12_class1" },
                            { amount: Infinity, rate: 2, name: "at2_class1"}],

            class2_LowerLimit: 5885,

            class4_bands: [{ amount: NIBandLimits.lowerBandAmount, rate: 0, name: "at0_class4" },
                            { amount: NIBandLimits.thresholdLimit, rate: 0, name: "atThreshold_class4" },
                            { amount: NIBandLimits.upperBandAmount, rate: 9, name: "at9_class4" },
                            { amount: Infinity, rate: 2, name: "at2_class4"}]
        },

        INCOME: {
            incomeDisregarded: 300,
            pa_personalAllowanceIncomeLimit: 27000,
            pa_allowanceAbated: true,
            pa_abatementLevel: 100000,
            pa_abatementRate: 50, // percentage
            pa_basicPersonalAllowance: 10000,
            pa_personalAllowanceOver64: 10500,
            pa_personalAllowanceOver74: 10660,

            mca_minimumAllowance: 3140,
            mca_maxAllowedAge: 79,
            mca_maximumAllowance: 8165,
            mca_rate: 0.10,

            incomeBands: [{ amount: 2880, rateSalary:0.20, rateInterest: 0.10, rateDividends: 0.10 },
                              { amount: 28985, rateSalary: 0.20, rateInterest: 0.20, rateDividends: 0.10 },
                              { amount: 118135, rateSalary: 0.40, rateInterest: 0.40, rateDividends: 0.325 },
                              { amount: Infinity, rateSalary: 0.45, rateInterest: 0.45, rateDividends: 0.375}]

        },

        TAXCREDITS: {
            WTC: {
                dividendTaxCreditRate: 0.1,
                lowestRate: 0.20,
                basicElementAmt: 1940,
                loneParentElementAmt: 1990,
                secondAdultElementAmt: 1990,
                hours30PlusElementAmt: 800,
                withdrawalRate: 0.41,
                thresholdLevel: 6420,
                includeLoneParentInRule: true,
                includeWithChildrenAgeMoreThan16Two: true
            },

            CTC: {
                childElementAmt: 2750,
                withdrawalRate: 0.41,
                thresholdLevel: 16010,
                thresholdIfWtcLevel: 6420
            },

            CTCFamilyElement: {
                maxFamilyElementAmt: 545,
                incomeThresholdLevel: 40000,
                withdrawalRate: 0.41,
                calcFamilyElementWithChildElement: true
            }
        }
    };

    return obj;
});
