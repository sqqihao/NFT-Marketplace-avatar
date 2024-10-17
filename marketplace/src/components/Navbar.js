import logo from '../logo_3.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import React from 'react';

import { Flex, Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

function Navbar(){
	const location = useLocation();
	const [currAddress,setCurrAddress] = useState('0x');

	const contentStyle = {
	  textAlign: 'center',
	  minHeight: 80,
	  lineHeight: '30px',
	  color: '#fff',
	  backgroundColor: '#7960ae',
	};

	const siderStyle = {
	  textAlign: 'center',
	  lineHeight: '100%',
	  color: '#fff',
	  backgroundColor: '#7960ae',
	};


	const indexpageMiddle = {
	  display: "grid",
      placeItems: "center",
      width:"100%",
      height:"100%",
	}

	return (
      <Layout>
        <Sider width="25%" style={siderStyle}>
            <Link to="/" style={indexpageMiddle}>
              	<span>NFT Marketplace</span>
            </Link>
        </Sider>
        <Content style={contentStyle}>
        	<ul className='l'>
              <li style={indexpageMiddle}>
                <ConnectButton />
              </li>
              <li className=''>
                <Link to="/">Marketplace</Link>
              </li>              
              <li className=''>
                <Link to="/sellNFT">SellNFT</Link>
              </li>
              <li className=''>
                <Link to="/profile">Profile</Link>
              </li>
            </ul>
        </Content>
      </Layout>

    );
}

export default Navbar