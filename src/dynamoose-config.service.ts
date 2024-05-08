import {
  DynamooseOptionsFactory,
  DynamooseModuleOptions,
} from 'nestjs-dynamoose';

export class DynamooseConfigService implements DynamooseOptionsFactory {
  createDynamooseOptions(): DynamooseModuleOptions {
    return {
      aws: {
        accessKeyId: 'AKIAVRUVSL7CF5GXKG5M',
        secretAccessKey: '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',
        region: 'eu-north-1',
      },
    };
  }
}