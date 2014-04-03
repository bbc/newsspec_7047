define(['bootstrap'], function (news) {

    /**
    * Function names may not sound descriptive on their own, but are used like so:
    *
    * var isFormValid = validate.form(1, forms);
    * var positive = validate.positiveNumber(-3);
    */
    var Validate = function () {

        /**
        * For the current form page: check that input fields only hold positive numbers.
        * No text, no commas, no funny business.
        */
        this.form = function (currentPage, forms) {
            var isFormValid = true;

            if (currentPage === 1) {
                isFormValid = this.page([forms.beer, forms.wine, forms.spirits, forms.cigarettes]);
            } else if (currentPage === 2) {
                isFormValid = this.page([forms.children, forms.yourage, forms.yourhoursworked, forms.partnerage, forms.partnerhoursworked]);
            } else if (currentPage === 3) {
                isFormValid = this.page([forms.yoursalary, forms.yourselfemployment, forms.yourdividends, forms.yourinterest, forms.yourrental, forms.yourpension, forms.partnersalary, forms.partnerselfemployment, forms.partnerdividends, forms.partnerinterest, forms.partnerrental, forms.partnerpension]);
            } else if (currentPage === 4) {
                isFormValid = this.page([forms.fuel, forms.fuel2, forms.companycar_listprice, forms.companycar_emissions, forms.partner_companycar_listprice, forms.partner_companycar_emissions]);
            }
            
            return isFormValid;
        };

        this.page = function (inputFields) {
            var isPageValid = true;
            var l = inputFields.length;
            for (var i = 0; i < l; i++) {
                var isNumberValid = this.positiveNumber(inputFields[i]);
                if (isNumberValid === false) {
                    isPageValid = false;
                }
            }
            return isPageValid;
        };

        // if a field is available then check that it contains a positive number to be valid
        this.positiveNumber = function (id) {
            var isValid = true;
            if (id) {
                var num = Number(id.value);
                if (isNaN(num) === true) {
                    isValid = false;
                } else if (num < 0) {
                    isValid = false;
                }
            }
            return isValid;
        };
        
        this.getRangedNumber = function (val) {
            if (val > 99) {
                val = 99;
            }
            else if (val < 0) {
                val = 0;
            }
            else if (isNaN(val)) {
                val = 0;
            }
            // @TODO: should this be a whole number, so round value up
            return val;
        };
    };

    return new Validate();
});