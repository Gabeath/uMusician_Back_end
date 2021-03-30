import * as moduleAlias from 'module-alias'
import * as path from 'path';

// @ts-ignore
moduleAlias.addAliases({
  '@app': path.join(__dirname, 'src'),
  '@core': path.join(__dirname, '..', 'core', 'src'),
});
