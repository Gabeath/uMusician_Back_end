/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constants,
  initializeEnv as initializeEnvCore,
} from '@core/constants';

class ConstantsClassAPP extends Constants {
  port: number;

  constructor(props: any) {
    super(props);

    this.port = parseInt(props.PORT, 10);
  }
}

let ConstantsAPP: ConstantsClassAPP;

export const initializeEnv: any = (props: any): void => {
  ConstantsAPP = new ConstantsClassAPP(props);
  initializeEnvCore(props);
};

export const getEnv = (): ConstantsClassAPP => ConstantsAPP;