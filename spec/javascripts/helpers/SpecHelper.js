beforeEach(function() {

  // do the types of arguments in each array match?
  function arrySignaturesMatch(array1, array2){
    // setup variables
    var ref, test;

    // we want to use the shorter array if one is longer
    if (array1.length >= array2.length) {
      ref = array2;
      test = array1;
    } else {
      ref = array1;
      test = array2;
    }

    // loop over the shorter array and make sure the coorestponding key in the longer array matches
    for(var key in ref) {
      if(typeof ref[key] === typeof test[key]) {
        
       // if the keys represent an object make sure that it matches.
        if(typeof ref[key] === "object" && typeof test[key] === "object") {
          if(!objectSignaturesMatch(ref[key], test[key])){
            return false;
          }
        }

        // if the keys represent an array make sure it matches
        if(typeof ref[key] === "array" && typeof test[key] === "array") {
          if(!arrySignaturesMatch(ref[key],test[key])){
            return false;
          }
        }

      }
    }
    return true;
  }

  // do the keys in object1 match object 2?
  function objectSignaturesMatch(object1, object2){
    
    // becuase typeof null is object we need to check for it here before Object.keys
    if(object1 === null && object2 === null){
      return true;
    }

    // if the objects have different lengths of keys we should fail immediatly
    if (Object.keys(object1).length !== Object.keys(object2).length) {
      return false;
    }
    
    // loop over all the keys in object1 (we know the objects have the same number of keys at this point)
    for(var key in object1) {

      // if the keys match keep checking if not we have a mismatch
      if(typeof object1[key] === typeof object2[key]) {

        if(typeof object1[key] === null && typeof object2[key] === null) {

        }

        // if the keys represent an object make sure that it matches.
        else if(object1[key] instanceof Array && object2[key] instanceof Array) {
          console.log(arrySignaturesMatch(object1[key],object2[key]));
          if(!arrySignaturesMatch(object1[key],object2[key])){
            return false;
          }
        }

        // if the keys represent an array make sure it matches
        else if(typeof object1[key] === "object" && typeof object2[key] === "object") {
          if(!objectSignaturesMatch(object1[key],object2[key])){
            return false;
          }
        }

      }
    }
    return true;
  }

  this.addMatchers({
  
    // this is a lazy matcher for jasmine spies.
    // it checks that the arguments for the last call made match all the
    // arguments that are passed into the function, but does not care if the
    // values match only that they are the same type.
    //
    // in short this only cares that all teh keys are the same and the types
    // of values are the same, not the values themselves
    toHaveBeenCalledWithArgsLike: function() {
      var refArgs = Array.prototype.slice.call(arguments);
      var calledArgs = this.actual.mostRecentCall.args;
      var arg;

      for(arg in refArgs){
        var ref = refArgs[arg];
        var test = calledArgs[arg];
                
        // if the types of the objects dont match
        if(typeof ref !== typeof test) {
          return false;
        // if ref and test are objects make then
        } else if(typeof ref === "object" && typeof test === "object") {
          if(!objectSignaturesMatch(ref, test)){
            return false;
          }
        } else if(typeof ref === "array" && typeof test === "array") {
          if(!arrySignaturesMatch(ref, test)){
            return false;
          }
        }
      }
      return true;
    },

    // this expects an objec to loosly match another objects signature
    objectToLooselyMatch: function(obj){
      return objectSignaturesMatch(this.actual, obj);
    },

    // this expects an array to loosly match another objects signature
    arrayToLooselyMatch: function(arr){
      return arrySignaturesMatch(this.actual, arr);
    },

    // match two arbitrary objects signatures
    objectSignaturesMatch: function(obj1, obj2) {
      objectSignaturesMatch(obj1, obj2);
    },
    // match two arbitrary objects signatures
    arrySignaturesMatch: function(array1, array2) {
      arrySignaturesMatch(array1, array2);
    },

    // expect the object to be of type
    toBeOfType: function(type){
      return typeof this.actual === type;
    },

    // expect the object to be of a certain instance
    toBeInstanceOfClass: function(classRef){
      return this.actual instanceof classRef;
    }

    
  });
});