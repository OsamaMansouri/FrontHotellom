import React from 'react'
import { Link } from 'react-router-dom'
import themeConfig from '@configs/themeConfig'

const brandLogoStyle = {
  width: '30px',
  height: '30px'
}

function BrandLogo() {
  return (
    <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
      <img style={brandLogoStyle} src={themeConfig.app.appSmallLogoImage} alt='logo' />
      <h2 className='brand-text text-primary ml-1'>{themeConfig.app.appName}</h2>
    </Link>
  )
}

export default BrandLogo
