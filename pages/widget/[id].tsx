import React from 'react'
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { db } from '../../utils/firebaseClient';
import { Widget } from '../../components/customise-widget-form/CustomiseWidgetForm';
import WidgetComponent, { WidgetProps } from '../../components/Widget';

export interface Wallet {
  id: string;
  name: string;
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

export const getStaticProps: GetStaticProps = async (context) => {
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

export const getStaticPaths: GetStaticPaths = async () => {
  const widgetResponse = await db.collection('widgets').get()
  const widgets: Widget[] = widgetResponse.docs.map(doc => ({
    ...doc.data() as Widget,
    id: doc.id
  }))

  const paths = widgets.map(widget => ({
    params: {id: widget.userId}
  }))

  return { paths, fallback: 'blocking' }
}
