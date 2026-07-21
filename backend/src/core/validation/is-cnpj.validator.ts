import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { hasValidCnpjStructure } from './cnpj.util';

@ValidatorConstraint({ name: 'isCnpj', async: false })
export class IsCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value === undefined || value === null || value === '') return true;
    return typeof value === 'string' && hasValidCnpjStructure(value);
  }

  defaultMessage(): string {
    return 'CNPJ deve conter 14 dígitos no formato xx.xxx.xxx/xxxx-xx.';
  }
}

export function IsCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCnpjConstraint,
    });
  };
}
