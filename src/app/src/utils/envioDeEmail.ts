import emailService from '@app/config/email';

const sendResetPasswordMail = async (name: string, to: string, codigo: string) : Promise<void> => {
  const email = {
    from: process.env.MAIL_USER,
    to,
    subject: 'Recuperação de senha - uMusician',
    text: `Olá ${name}, notamos que você solicitou a redefinição de senha. O código para prosseguir com 
      a solicitação é ${codigo}. Não compartilhe! Se não foi você, ignore esta mensagem.`,
    html: `
          <h2> Olá, ${name} </h2>
          <p> Notamos que você solicitou a redefinição de senha. O código para prosseguir com 
          a solicitação é: </p>
          <p> ${codigo} </p>
          <p> Este código expira em 24 horas.</p>
          
          <p><strong>Não compartilhe!</strong> Se não foi você, ignore esta mensagem.</p>
      `
  };
  await emailService.sendMail(email);
};

export {sendResetPasswordMail};