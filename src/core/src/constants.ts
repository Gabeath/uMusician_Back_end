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

  constructor(props: any) {
    this.env = props.NODE_ENV;
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

  }
}

let ConstantsEnv: Constants;
export const initializeEnv: (props: any) => void = (props: any): void => {
  ConstantsEnv = new Constants(props);
};

export const getEnv: () => Constants = (): Constants => ConstantsEnv;