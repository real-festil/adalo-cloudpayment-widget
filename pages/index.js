import Head from 'next/head';
import Script from 'next/script';
import { useState } from 'react';
import 'react-credit-cards/es/styles-compiled.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import styles from '../styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const [widget, setWidget] = useState(null);
  const { price, description, email, invoiceId, publicId, notificationDate } =
    router.query;

  const onPay = async () => {
    // eslint-disable-next-line no-undef
    const scriptWidget = new cp.CloudPayments();

    setWidget(scriptWidget);
  };

  const chargePayment = () => {
    const receipt = {
      Items: [
        {
          label: description, // наименование товара
          price, // цена
          quantity: 1.0, // количество
          amount: price, // сумма
          vat: 20, // ставка НДС
          method: 0, // тег-1214 признак способа расчета - признак способа расчета
          object: 0, // тег-1212 признак предмета расчета - признак предмета товара, работы, услуги, платежа, выплаты, иного предмета расчета
        },
      ],
      taxationSystem: 0, // система налогообложения; необязательный, если у вас одна система налогообложения
      email, // e-mail покупателя, если нужно отправить письмо с чеком
      phone: ``, // телефон покупателя в любом формате, если нужно отправить сообщение со ссылкой на чек
      isBso: false, // чек является бланком строгой отчетности
      // amounts: {
      //   electronic: 900.0, // Сумма оплаты электронными деньгами
      //   advancePayment: 0.0, // Сумма из предоплаты (зачетом аванса) (2 знака после запятой)
      //   credit: 0.0, // Сумма постоплатой(в кредит) (2 знака после запятой)
      //   provision: 0.0, // Сумма оплаты встречным предоставлением (сертификаты, др. мат.ценности) (2 знака после запятой)
      // },
    };

    const data = {};
    data.CloudPayments = {
      CustomerReceipt: receipt, // чек для первого платежа
      recurrent: {
        interval: `Month`,
        period: 1,
        customerReceipt: receipt, // чек для регулярных платежей
      },
    };

    widget.charge(
      {
        // options
        publicId, // id из личного кабинета
        description, // назначение
        amount: Number(price), // сумма
        currency: `RUB`, // валюта
        invoiceId, // номер заказа  (необязательно)
        accountId: email, // идентификатор плательщика (обязательно для создания подписки)
        data,
      },
      async () => {
        const date = moment().add(1, `M`);
        console.log(`date`, date);
        const axiosData = {
          token: `ers5u9uvg4mln8qr6icacwy4q`,
          appId: `a35caf30-d872-4178-81ee-69c9d4195a75`,
          email,
          date: notificationDate || date,
          titleText: `День оплаты`,
          bodyText: `Сегодня будет списана оплата за тариф`,
        };
        await axios.post(
          `https://adalo-notifications.herokuapp.com/`,
          axiosData,
        );
      },
    );
  };

  if (widget && price) {
    chargePayment(price);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>CloudPayment Web</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {widget ? null : (
        <Script
          id="widget"
          src="https://widget.cloudpayments.ru/bundles/cloudpayments.js"
          strategy="beforeInteractive"
          onReady={onPay}
        />
      )}
    </div>
  );
}
