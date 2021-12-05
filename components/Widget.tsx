import { ClipboardCopyIcon } from '@heroicons/react/outline';
import copy from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react'
import { Wallet } from '../pages/widget/[id]';
import CryptoSelect, { CryptoSelectProps } from './CryptoSelect';
import { toDataURL } from 'qrcode';
import { CheckIcon } from '@heroicons/react/solid';

export interface WidgetProps {
    readonly firstName: string;
    readonly availableWallets: Wallet[];
    readonly widgetColor: string;
}

const WidgetComponent: React.FC<WidgetProps> = ({
    firstName,
    availableWallets,
    widgetColor
}) => {
    const [selectedWalletId, setSelectedWalletId] = useState<string>(availableWallets[0]?.id);
    const [selectedWallet, setSelectedWallet] = useState<Wallet>(availableWallets[0]);
    const [src, setSrc] = useState<string>('')
    const [isCopied, setIsCopied] = useState(false)

    const css = `
        body {
        --heading-color: ${widgetColor ?? '#FF8906'}
        }
    `

    const handleOnChange = (value: string) => {
        setSelectedWalletId(value);
        setSelectedWallet(availableWallets.find(wallet => wallet.id === value))
    }

    const handleCopyAddress = () => {
        setIsCopied(true)
        copy(selectedWallet.public_address)
        setTimeout(() => setIsCopied(false), 2000)
    }

    const cryptoSelectProps: CryptoSelectProps = {
        handleOnChange,
        availableWallets,
        selectedWallet,
        selectedWalletId
    }

    const generateQRCode = async (text: string) => {
        const src = await toDataURL(text)
        setSrc(src)
    }

    useEffect(() => {
        if(!!selectedWallet){
            generateQRCode(selectedWallet.public_address)
        }
    }, [selectedWallet])

    useEffect(() => {
        if(!!availableWallets.length){
            setSelectedWallet(availableWallets[0])
            setSelectedWalletId(availableWallets[0].id)
        }
    }, [availableWallets])

    return (
        <>
            <style>{css}</style>
            <div className='flex items-center text-white justify-center text-lg w-full h-14 bg-heading-color font-sora'>
                <span>
                    Buy{` ${firstName} `}a Crypto Coffee
                </span>
            </div>
            <CryptoSelect {...cryptoSelectProps} />
            {
            !!selectedWallet && (
                <>
                    <div className='w-4/5 flex items-center h-10 mt-4 bg-gray-200 rounded-md'>
                        <span className='flex items-center truncate px-3 w-4/5 h-full'>{selectedWallet.public_address}</span>
                        <div className='w-max h-full ml-auto pr-3 pl-3 flex items-center cursor-pointer' onClick={handleCopyAddress}>
                        {
                            isCopied ? (
                                <CheckIcon className="w-5 h-5 text-green-600 transition-all" />
                            ) : (
                                <ClipboardCopyIcon
                                    className="w-5 h-5 text-gray-500 transition-all"
                                />
                            )
                        }
                        </div>
                    </div>
                    <img className='mt-4' src={src} width={200} height={200} />
                </>
            )
            }
            <footer className='mt-auto flex items-center justify-center sticky h-10 w-full'>
                <a href='https://www.buymeacryptocoffee.xyz/' target="_blank" rel="noopener noreferrer" className='text-blue-400'>Get your own widget</a>
            </footer>
        </>
    )
}

export default WidgetComponent;