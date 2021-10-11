import { CronJob } from 'cron';
import { DateTime } from 'luxon';
import { getManager } from 'typeorm';
const entityManager = getManager();

function getDate12HoursAgo(){
  const date = DateTime.now();
  const newDate = date.plus({
    hours: -12
  });
  return newDate;
}

async function executeQuery() : Promise<any>{
  const query = entityManager.query(`
  UPDATE servico
  SET situacao = 6
  where (situacao = 3 and "idEvento" in(
    select id from "evento" where "dataInicio" <= $1
  )) or (situacao = 1 and "idEvento" in (
    select id from "evento" where "dataTermino" <= $2
  ))
`,[DateTime.now(), getDate12HoursAgo()]);

  return query
    .then()
    .catch(err => {
      console.log('Falha ao executar job de atualizar serviços: ');
      console.log(err);
    });
}



const job = new CronJob('0 */1 * * * *', () => {
  executeQuery();
});

export default job;