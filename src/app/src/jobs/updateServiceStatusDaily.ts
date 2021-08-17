import { CronJob } from 'cron';
import { DateTime } from 'luxon';
import { getManager } from 'typeorm';
const entityManager = getManager();

const query = entityManager.query(`
  UPDATE servico
  SET situacao = 6
  where situacao = 3 and "idEvento" in(
    select id from "evento" where "dataInicio" <= $1
  )
`,[DateTime.now()]);

const job = new CronJob('0 */1 * * * *', () => {
  query
    .then()
    .catch(err => {
      console.log('Falha ao executar job de atualizar serviços: ');
      console.log(err);
    });
});

export default job;