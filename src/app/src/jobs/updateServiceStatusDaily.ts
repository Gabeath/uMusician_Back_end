import {CronJob} from 'cron';
import { getManager } from 'typeorm';
const entityManager = getManager();

const query = entityManager.query(`
  SELECT * FROM "usuario";
`,);

const job = new CronJob('* * * * * *',() => {
  query.then(res => {
    console.log(res[0]);
  })
});

export default job;