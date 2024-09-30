import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsDateFormatConstraint implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments) {
    const [format] = args.constraints;
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!regex.test(date)) {
      return false;
    }

    const [day, month, year] = date.split('/').map(Number);
    const dateObj = new Date(`${year}-${month}-${day}`);

    return (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() + 1 === month &&
      dateObj.getDate() === day
    );
  }

  defaultMessage(args: ValidationArguments) {
    const [format] = args.constraints;
    return `Date must be in the format ${format}`;
  }
}

export function IsDateFormat(
  format: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [format],
      validator: IsDateFormatConstraint,
    });
  };
}
