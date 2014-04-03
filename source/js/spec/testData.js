define(function () {

    /*
        IMPORTANT: You will need to update the value of each `expectedResult` every year- based on KPMG's own calculator- for your tests to pass. You may need to round the figure down. http://2014.kpmgbudgetcalculator.co.uk/

        Flaws in our tests: we only check absolute values, i.e. we currently don't check whether the result is negative. You may be "£0.89 better off" or "£0.89 worse off" (i.e. -£0.89) and in both cases the expectedResult would be '£0.89'.

        Testing tips:

            * Debug your tests better by viewing in the browser:
                file://localhost/Users/--YOUR USER ID--/Sites/bbc/news/special/2014/newsspec_7047/_SpecRunner.html
            * Comment/uncomment out lines towards the bottom of this script to include/remove test data from your tests so that you can test individual test data in isolation.

        `defaultInputs` is the full set of (default) values. For your test data, only copy the fields you need (i.e. don't copy all of this if you're only tweaking 'beer')! NB: `defaultInputs` is used to 'reset' the calculator in between testing each dataset.
    */
    var defaultInputs = {
            expectedResult:             '£0.00',
            inputs: {
                alcohol: {
                    beer:               '0',
                    wine:               '0',
                    spirits:            '0',
                    cigarettes:         '0'
                },
                you: {
                    details: {
                        gender:         'female',
                        age:            '21',
                        hours:          '0',
                        status:         'single',   // if 'single' or 'divorced', the 'include partner' checkbox remains unchecked.
                        children:       '0'
                    },
                    income: {
                        salary:         '0',
                        selfEmployment: '0',
                        dividends:      '0',
                        interest:       '0',
                        rental:         '0',
                        pension:        '0'
                    },
                    transport: {
                        car: {
                            emission:   'nocar',
                            fuel:       '0',
                            fuelType:   'unleaded'
                        },
                        company: {
                            car: {
                                emission:     '0',
                                listPrice:    '0',
                                diesel:       false,
                                fuelProvided: false
                            },
                            van: {
                                fuelProvided: false,
                                privateUse:   false
                            }
                        }
                    }
                },
                partner: {
                    details: {
                        gender:         'female',
                        age:            '21',
                        hours:          '0'
                    },
                    income: {
                        salary:         '0',
                        selfEmployment: '0',
                        dividends:      '0',
                        interest:       '0',
                        rental:         '0',
                        pension:        '0'
                    },
                    transport: {
                        car: {
                            emission:   'nocar',
                            fuel:       '0',
                            fuelType:   'unleaded'
                        },
                        company: {
                            car: {
                                emission:     '0',
                                listPrice:    '0',
                                diesel:       false,
                                fuelProvided: false
                            },
                            van: {
                                fuelProvided: false,
                                privateUse:   false
                            }
                        }
                    }
                },
                includeCompanyCars: false   // decides whether or not the 'include company car' checkbox is checked
            }
        },

        /*
            Quick check to see the calculations match.
        */

        testData1 = {
            expectedResult:  '£0.89', // LAST UPDATED - 2014
            inputs: {
                alcohol: {
                    beer:       '2',
                    wine:       '3'
                }
            }
        },

        /*
            More detailed check, including our partner's details.
        */

        testData2 = {
            expectedResult:  '£177', // LAST UPDATED - 2014
            inputs: {
                you: {
                    details: {
                        'status': 'married'
                    }
                },
                partner: {
                    details: {
                        'gender': 'male',
                        'age':    '40',
                        'hours':  '40'
                    },
                    income: {
                        salary:   '55000'
                    }
                }
            }
        },

        /*
            Same data as above, but with our status set to 'divorced'. Our partner's details shouldn't affect the results.
        */

        testData3 = {
            expectedResult:  '£0.00', // LAST UPDATED - 2014
            inputs: {
                you: {
                    details: {
                        'status': 'divorced'
                    }
                },
                partner: {
                    details: {
                        'gender': 'male',
                        'age':    '40',
                        'hours':  '40'
                    },
                    income: {
                        salary:   '55000'
                    }
                }
            }
        },

        /*
            Simple car data test.
        */

        testData4 = {
            expectedResult:  '£5.00', // LAST UPDATED - 2014
            inputs: {
                you: {
                    transport: {
                        car: {
                            emission: 'medium'
                        }
                    }
                }
            }
        },

        /*
            Complex car data test.
        */

        testData5 = {
            expectedResult:  '£102', // LAST UPDATED - 2014
            inputs: {
                you: {
                    transport: {
                        car: {
                            emission: 'veryhigh'
                        },
                        company: {
                            car: {
                                emission:     '200',
                                listPrice:    '15000',
                                diesel:       true,
                                fuelProvided: true
                            }
                        }
                    }
                },
                includeCompanyCars: true
            }
        },

        /*
            Complex combination of all fields.

            Sorry about this - it will take a while for you to put these details into KPMG's calculator, but at least then we have an automated test and can have ultimate confidence in our calculator.
        */

        testData6 = {
            expectedResult:             '£237',
            inputs: {
                alcohol: {
                    beer:               '13',
                    wine:               '4',
                    spirits:            '2',
                    cigarettes:         '14'
                },
                you: {
                    details: {
                        gender:         'male',
                        age:            '33',
                        hours:          '41',
                        status:         'civilpartnership',
                        children:       '2'
                    },
                    income: {
                        salary:         '30000',
                        selfEmployment: '2000',
                        dividends:      '1000',
                        interest:       '500',
                        rental:         '9000',
                        pension:        '2000'
                    },
                    transport: {
                        car: {
                            emission:   'high',
                            fuel:       '35',
                            fuelType:   'diesel'
                        },
                        company: {
                            car: {
                                emission:     '300',
                                listPrice:    '12000',
                                diesel:       false,
                                fuelProvided: true
                            },
                            van: {
                                fuelProvided: true,
                                privateUse:   false
                            }
                        }
                    }
                },
                partner: {
                    details: {
                        gender:         'female',
                        age:            '36',
                        hours:          '37'
                    },
                    income: {
                        salary:         '50000',
                        selfEmployment: '0',
                        dividends:      '0',
                        interest:       '0',
                        rental:         '0',
                        pension:        '0'
                    },
                    transport: {
                        car: {
                            emission:   'low',
                            fuel:       '40',
                            fuelType:   'unleaded'
                        },
                        company: {
                            car: {
                                emission:     '400',
                                listPrice:    '20000',
                                diesel:       true,
                                fuelProvided: false
                            },
                            van: {
                                fuelProvided: true,
                                privateUse:   true
                            }
                        }
                    }
                },
                includeCompanyCars: true
            }
        },

        testDataArray = [];

    // manually pushing test data to array gives us complete control over which data to test.
    testDataArray.push(testData1);
    testDataArray.push(testData2);
    testDataArray.push(testData3);
    testDataArray.push(testData4);
    testDataArray.push(testData5);
    testDataArray.push(testData6);

    return {
        reset: defaultInputs,
        test: testDataArray
    };
});