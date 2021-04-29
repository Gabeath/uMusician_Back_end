/* eslint-disable */
import * as moduleAlias from 'module-alias';
import * as path from 'path';

moduleAlias.addAliases({
  '@app': path.join(__dirname, 'src'),
  '@core': path.join(__dirname, '..', 'core', 'src'),
});
