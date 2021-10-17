import React, { useState } from 'react'
import Head from 'next/head'
import { ClipboardCopyIcon } from '@heroicons/react/solid'
import CryptoSelect, { CryptoSelectProps } from '../../components/CryptoSelect';
import { GetServerSideProps } from 'next';
import { db } from '../../utils/firebaseClient';
import { Widget } from '../../components/customise-widget-form/CustomiseWidgetForm';
import copy from 'copy-to-clipboard';

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

  const { widgetColor, wallet_address, firstName, websiteUrl } = widget;

  const availableWallets = wallet_address.filter(wallet => !!wallet.public_address.length);

  const [selectedWalletId, setSelectedWalletId] = useState<string>(availableWallets[0].id);
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(availableWallets[0]);

  const handleOnChange = (value: string) => {
    setSelectedWalletId(value);
    setSelectedWallet(availableWallets.find(wallet => wallet.id === value))
  }

  const handleCopyAddress = () => {
    copy(selectedWallet.public_address)
  }

  const cryptoSelectProps: CryptoSelectProps = {
    handleOnChange,
    availableWallets,
    selectedWallet,
    selectedWalletId
  }

  const css = `
    body {
      --heading-color: ${!!widgetColor ? `${widgetColor}` : '#FF8906'}
    }
  `

  return (
    <div className="flex flex-col items-center min-h-screen">
        <style>{css}</style>
        <Head key='main-head'>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
            <link href="https://fonts.googleapis.com/css2?family=Sora&display=swap" rel="stylesheet" />
        </Head>
        <div className='flex items-center text-white justify-center text-lg w-full h-14 bg-heading-color font-sora'>
            Buy
            <a className='mx-2' href={`http://${websiteUrl}`} target="_blank" rel="noopener noreferrer">{` ${firstName} `}</a>
            a Crypto Coffee
        </div>
        <CryptoSelect {...cryptoSelectProps} />
        {
          !!selectedWallet && (
            <>
              <div className='w-4/5 flex items-center h-10 mt-4 bg-gray-200 rounded-md'>
                <span className='flex items-center truncate px-3 w-4/5 h-full'>{selectedWallet.public_address}</span>
                <div className='w-max h-full ml-auto pr-3 pl-3 flex items-center cursor-pointer' onClick={handleCopyAddress}>
                  <ClipboardCopyIcon
                    className="w-5 h-5 text-gray-500"
                  />
                </div>
              </div>
              <img className='mt-4' src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedWallet.public_address}`} />
            </>
          )
        }
        <footer className='mt-auto flex items-center justify-center sticky h-10 w-full'>
          <a href='https://www.buymeacryptocoffee.xyz/' target="_blank" rel="noopener noreferrer" className='text-blue-400'>Get your own widget</a>
        </footer>
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
