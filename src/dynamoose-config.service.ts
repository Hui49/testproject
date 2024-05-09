import {
  DynamooseOptionsFactory,
  DynamooseModuleOptions,
} from 'nestjs-dynamoose';

export class DynamooseConfigService implements DynamooseOptionsFactory {
  createDynamooseOptions(): DynamooseModuleOptions {
    return {
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
    };
  }
}