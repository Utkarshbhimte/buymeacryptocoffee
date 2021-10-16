import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ClipboardCopyIcon } from '@heroicons/react/solid'
import CryptoSelect, { CryptoSelectProps } from '../components/CryptoSelect';

export interface Wallet {
  id: string;
  name: string;
  public_address: string;
}

export default function Home() {
  const router = useRouter();
  const { color } = router.query;
  const availableWallets: Wallet[] = [
    {id: '1', name: 'Bitcoin', public_address: '1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX'},
    {id: '2', name: 'Ethereum', public_address: '0xCF193782f2eBC069ae05eC0Ef955E4B042D000Dd'},
    {id: '3', name: 'Solana', public_address: 'HekM1hBawXQu6wK6Ah1yw1YXXeMUDD2bfCHEzo25vnEB'}
  ];
  const [selectedWalletId, setSelectedWalletId] = useState<string>(availableWallets[0].id);
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(availableWallets[0])
  const firstName = 'Akhil';

  const handleOnChange = (value: string) => {
    setSelectedWalletId(value);
    setSelectedWallet(availableWallets.find(wallet => wallet.id === value))
  }

  const handleCopyAddress = async () => {
    try {
      navigator.clipboard.writeText(selectedWallet.public_address)
    } catch(error) {
      console.error(error)
    }
  }

  const cryptoSelectProps: CryptoSelectProps = {
    handleOnChange,
    availableWallets,
    selectedWallet,
    selectedWalletId
  }

  const css = `
    body {
      --heading-color: ${!!color ? `#${color}` : '#FF8906'}
    }
  `

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div>
        <style>{css}</style>
        <Head key='main-head'>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
            <link href="https://fonts.googleapis.com/css2?family=Sora&display=swap" rel="stylesheet" />
        </Head>
        <div className='flex items-center text-white justify-center text-lg w-full h-14 bg-heading-color font-sora'>
            Buy {firstName} a Crypto Coffee
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
    </div>
  )
}

