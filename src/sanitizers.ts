export function componentName(type: string) {

  return (value: string) => {

    let name = value.toLowerCase().trim();

    if ( name.substr(-type.length) === type ) name = name.substr(0, name.length - type.length - 1);
    if ( name.substr(-1) === '-' ) name = name.substr(0, name.length - 1);

    return name;

  };

}
