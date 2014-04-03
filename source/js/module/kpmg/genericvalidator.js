define([
    "errormodule"    
    ], function (errorModule) {

        var errors = new Array();

        var Validate = function (inputs) {
            ValidateRecursive(inputs);
            return errors;
        };

        var ValidateRecursive = function (inputs) {
            for (var i in inputs) {
                if (i === "validation") {
                    ValidateOne(inputs);
                }
                else {
                    if (typeof inputs[i] === 'object') {
                        ValidateRecursive(inputs[i])
                    }
                }
            }
        };

        var ValidateOne = function (one) {
            if (one.validation !== undefined) {
                for (var j in one.validation) {
                    if (one.validation.hasOwnProperty(j)) {
                        var propertyName = one.validation[j].propertyName;
                        var dataType = one.validation[j].dataType;
                        var error = {};
                        var isvalid = validators[dataType](one[propertyName], error);

                        if (!isvalid) {
                            errors[errors.length] = errorModule.CreateError(error.code, error.msg, one, propertyName);
                        }
                    }
                }
            }
        };
        
        var IsValidPositiveNumber = function (expNo, error) {
            var regexNumber = new RegExp("^\\+?[0-9]*(?:\\.[0-9]*)?$");
            var result = regexNumber.test(expNo) && !isNaN(expNo) && Number(expNo) >= 0;
            if (!result) {
                error.code = 1;
                error.msg = "Value is not a valid positive number";
            }
            return result;
        };

        var IsGreaterThanZeroNumber = function (expNo, error) {
            var regexNumber = new RegExp("^\\+?[0-9]*(?:\\.[0-9]*)?$");
            var result = regexNumber.test(expNo) && !isNaN(expNo) && Number(expNo) > 0;
            if (!result) {
                error.code = 1;
                error.msg = "Value is not a valid positive number";
            }
            return result;
        };

        var IsValidString = function (expString, error) {
            var result = typeof expString === 'string';
            if (!result) {
                error.code = 2;
                error.msg = "Value is not a string";
            }
            return result;
        };

        var IsValidBool = function (expBool, error) {
            var result = typeof expBool === 'boolean';
            if (!result) {
                error.code = 3;
                error.msg = "Value is not a boolean";
            }
            return result;
        };

        var IsValidGender = function (expGender, error) {

            var result = expGender != null;
            if (result) {
                result = expGender.toLowerCase() === 'male' || expGender.toLowerCase() === 'female' || expGender.toLowerCase() === 'neutral';
                if (!result) {
                    error.code = 4;
                    error.msg = "Value is not a valid Gender";
                }
            }
            return result;
        };

        var IsValidMartialStatus = function (expStatus, error) {
            var result = expStatus != null;
            if (result) {
                result = expStatus !== null || expStatus.toLowerCase() === 'single' || expStatus.toLowerCase() === 'married';
                if (!result) {
                    error.code = 5;
                    error.msg = "Value is not a boolean";
                }
            }
            return result;
        };

        var IsPositiveWholeNumber = function (expNo, error) {
            var regexNumber = new RegExp("^\\+?[0-9]*$");
            var result = regexNumber.test(expNo) && !isNaN(expNo) && Number(expNo) >= 0;
            if (!result) {
                error.code = 6;
                error.msg = "Value is not a whole positive number";
            }
            return result;
        };

        var clear = function () {
            errors = [];
        };

        var validators = new Array();

        validators["string"]              = IsValidString;
        validators["positivenumber"]      = IsValidPositiveNumber;
        validators["greaterThanZero"]     = IsGreaterThanZeroNumber;
        validators["boolean"]             = IsValidBool;
        validators["gender"]              = IsValidGender;
        validators["martialstatus"]       = IsValidMartialStatus;
        validators["positiveWholeNumber"] = IsPositiveWholeNumber;
        return {
            IsValid: Validate,
            Clear: clear
        }
    });
