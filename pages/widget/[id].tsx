import React from 'react'
import { GetServerSideProps } from 'next';
import { db } from '../../utils/firebaseClient';
import { Widget } from '../../components/customise-widget-form/CustomiseWidgetForm';
import WidgetComponent, { WidgetProps } from '../../components/Widget';

export interface Wallet {
  id: string;
  name: string;
  short_name: string;
  public_address: string;
}

export default function Home({ widget }: {
    widget: Widget
}) {

  if(!widget) {
      return (
          <div>
              Widget not found
          </div>
      )
  }

  const { widgetColor, wallet_address, firstName } = widget;

  const availableWallets = wallet_address.filter(wallet => !!wallet.public_address.length);

  const widgetComponentProps: WidgetProps = {
    widgetColor,
    firstName,
    availableWallets
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <WidgetComponent 
        {...widgetComponentProps}
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userId = context.params.id
    const widgetResponse = await db.collection('widgets').where('userId', '==', userId).get()
    const widget = {
        ...widgetResponse.docs[0].data(),
        id: widgetResponse.docs[0].id
    }

    return {
        props: {
            widget
        }
    }
}
