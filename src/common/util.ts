export default class Util {

  kebabToPascal(kebabName: string): string {

    let pascalName = kebabName[0].toUpperCase() + kebabName.substr(1);

    for ( let i = 0; i < pascalName.length; i++ ) {

      if ( pascalName[i] !== '-' ) continue;

      pascalName = pascalName.substr(0, i) + pascalName.substr(i + 1, 1).toUpperCase() + pascalName.substr(i + 2);
      i--;

    }

    return pascalName;

  }

  capitalize(string: string): string {

    return string.substr(0, 1).toUpperCase() + string.substr(1);

  }

}
