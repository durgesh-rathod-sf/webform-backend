export function setCreatedOn() {
  console.log('setCreatedOn called');
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const origMethod = descriptor.value;
    descriptor.value = function (...args: any) {
      console.log('args is ', args);
      args[0].createdOn = new Date().toISOString();
      args[0].modifiedOn = new Date().toISOString();
      return origMethod.apply(this, args);
    };
  };
}

export function setUpdatedOn() {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('setUpdatedOn called');
    const origMethod = descriptor.value;
    descriptor.value = function (...args: any) {
      console.log('args is ', args);
      // args[0].createdOn = new Date().toISOString();
      args[0].modifiedOn = new Date().toISOString();
      return origMethod.apply(this, args);
    };
  };
}
