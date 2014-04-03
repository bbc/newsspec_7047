define(function () {

    var DoCreateError = function ( errorCode, errorMsg, errorType, errorSource ) {

        var errorObj = {
            errorCode: errorCode,
            errorMsg: errorMsg,
            errorType: errorType,
            errorSource: errorSource
        };

        return errorObj;
    };

    return {
        CreateError: DoCreateError
    }

});