import { Col, Divider, Row, Button ,Space,Input,Upload,message,Image, Spin} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from "react";
import { PinataSDK } from "pinata-web3"
import Navbar from "./Navbar";
import NFTtile from "./NFTtile";
import { ethers } from 'ethers';
import {conf} from "../conf.js";
import {config} from "../wagmiconf.js";
import { useAccount,useWriteContract } from 'wagmi'
import { readContract,writeContract ,simulateContract,getAccount} from '@wagmi/core'
import { getTransaction,getTransactionReceipt } from '@wagmi/core'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card  } from 'antd';
const { Meta } = Card;

function MarketPlace(){

	const { address } = getAccount(config);
	const [ NFTS,setNFTS] = useState([]);
	const [dataFetched, updateFetched] = useState(false);


	async function getALLNFTs(){
		let aNFTs = await readContract(config,{
			address: conf.constractAddr,
			abi: conf.constractAbi,
			account: address, 
			functionName: "getALLNFTs"
		});
		// 
		console.log(aNFTs);
		setNFTS(aNFTs);
		// setNFTS([]);
	}		
	// debugger;
	if(!dataFetched){
		
		getALLNFTs();
		updateFetched(true);	
	}






	return (<div>
		<Navbar></Navbar>
		<Row gutter={16}>
				{NFTS.map((nft,index)=>{
					return 	(
						<NFTtile  key={index} id={nft.tokenId} value={nft.price} seller={nft.seller}  address={address} displaybuy="true" ishidden={address==nft.seller}></NFTtile>
					);
				})}
			
		</Row>
	</div>)
}

export default MarketPlace