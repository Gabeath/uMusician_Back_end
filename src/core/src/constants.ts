/* eslint-disable */
export class Constants {
  env: 'production' | 'stage' | 'development';
  debug: boolean;
  appName: string;

  database: {
    hostWrite: string,
    name: string,
    user: string,
    password: string,
    pool: {
      max: number,
      min: number,
      acquire: number,
      idle: number,
    },
  };

  credential: {
    secret: string,
    iterations: number,
    keylen: number,
    digest: string,
  };

  constructor(props: any) {
    this.env = props.NODE_ENV as 'production' | 'stage' | 'development';
    this.appName = 'uMusician Back-end';

    this.debug = props.DEBUG === 'true';

    this.database = {
      hostWrite: 'queenie.db.elephantsql.com',
      name: 'kazhyesx',
      user: 'kazhyesx',
      password: '3GckeR1y5oRt57Cl4xd-DYjhNegw7JM9',
      pool: {
        max: 10,
        min: 1,
        acquire: 10000,
        idle: 20000,
      },
    };

    this.credential = {
      secret: 'dcdec30a-518c-4fab-9121-e11d6306fba6',
      iterations: 1000,
      keylen: 64,
      digest: 'sha512',
    };
  }
}

let ConstantsEnv: Constants;
export const initializeEnv: (props: any) => void = (props: any): void => {
  ConstantsEnv = new Constants(props);
};

export const getEnv: () => Constants = (): Constants => ConstantsEnv;