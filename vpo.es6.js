const isUndefined = (val) => typeof val === 'undefined';

const setValueByPath = (object, path, value) => {
  let splitPath = path.split('.');
  let {obj, key} = splitPath.reduce(
    (obj, key, currentIndex, arr) => {
      if(!obj[key]){
        obj[key] = Number.isNaN(Number( arr[currentIndex+1] )) ? {} : [];
      }
      return currentIndex === arr.length - 1 ? {obj, key} : obj[key];
    }
  ,object);
  obj[key] = value;
}

const getValueByPath = (object, path, fallback) => {
  let splitPath = path.split('.');
  let final = splitPath.reduce((obj, key) => {
    return  ( obj && !isUndefined(obj[key]) ) ? obj[key] : undefined;
  }, object)
  return isUndefined(final) ? fallback : final;
}

const getPathByMatchingValue = (obj, value) => {
  let finalPath = '';
  let trace = [];
  let iterator = (obj, value) => {
    // find all object keys
    for (let key in obj) {
      // add it to the stack
      trace.push(key);
      if (typeof obj[key] === 'object') {
        // call the recursive function
        iterator(obj[key], value);
        trace.pop();
      } else {
        if (obj[key] !== value) {
          // remove it from the stack
          trace.pop();
        } else {
          // yay, found him. print the stack to finalPath
          // trace.pop();
          finalPath = trace.join('.');
        }
      }
    }
  };
  iterator(obj, value);
  return finalPath;
}

const getSome = (object, paths, fallback) => {
  let result;
  paths.some(function(path) {
    return (result = getValueByPath(object, path));
  });
  return isUndefined(result) ? fallback : result;
}

const pick = (obj, paths) => paths.reduce((result, path) => {
  let value = getValueByPath(obj, path, undefined);
  if ( !isUndefined(value) ) {
    setValueByPath(result, path, value);
  }
  return result;
},{});


const setOnObjectPrototype = () => {
  Object.prototype.set = function(path, value) {
    setValueByPath(this, path, value);
  };

  Object.prototype.get = function(path, fallback) {
    return getValueByPath(this, path, fallback);
  };
}

module.exports = {
  set:setValueByPath,
  get:getValueByPath,
  getByValue:getPathByMatchingValue,
  setOnObjectPrototype,
  getSome,
  pick
};
