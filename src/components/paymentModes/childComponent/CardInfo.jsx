import { Link } from '@mui/material'
import React from 'react'
import ImageComponents from '../../../../Shared/ImageComponents'

function CardInfo() {
  return (
    <div className='card-info'>
        <ul>
            <li>
                <Link>
                    <ImageComponents name={'hdfc'} />  <span>HDFC</span>
                </Link>
            </li>
            <li>
                <Link>
                    <ImageComponents name={'icic'} /> <span>ICICI</span>
                </Link>
            </li>
            <li>
                <Link>
                    <ImageComponents name={'hdfc'} /> <span>SBI</span>
                </Link>
            </li>
            <li>
                <Link>
                    <ImageComponents name={'KotatMahindra'} /> <span>Kotak Mahindra</span>
                </Link>
            </li>
            <li>
                <Link>
                    <ImageComponents name={'PNB'} /> <span>ICIC Bank</span>
                </Link>
            </li>
            <li>
                <Link>
                    <ImageComponents name={'bob'} /> <span>Bank of Baroda</span>
                </Link>
            </li>
        </ul>
    </div>
  )
}

export default CardInfo
