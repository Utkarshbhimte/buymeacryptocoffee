import React from 'react';
import Image from 'next/image'
import cryptocoffee from '../../assets/cryptocoffee.png'

const Logo: React.FC = () => { 
    return (
        <div className='font-urbanist font-semibold text-2xl'>
            <Image 
                src={cryptocoffee}
            />
        </div>
    )
}

export default Logo