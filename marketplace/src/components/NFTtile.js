import { Col, Divider, Row, Button ,Space,Input,Upload,message,Image, Spin} from 'antd';
import { useAccount,useWriteContract } from 'wagmi'
import { readContract,writeContract ,simulateContract,getAccount} from '@wagmi/core'
import { getTransaction,getTransactionReceipt } from '@wagmi/core'
import { ethers } from 'ethers';
import {conf} from "../conf.js";
import {config} from "../wagmiconf.js";
import { Avatar, Card  } from 'antd';
import React, { useState, useEffect } from "react";
import { DollarTwoTone } from '@ant-design/icons';


const { Meta } = Card;

function NFTtile(props){
	console.log(props);
	const tokenId = props.id;
	const displaybuy = props.displaybuy;
	const ishidden = props.ishidden;
	// const {displaybuy,tokenId} = props;
	// const [ price,setPrice] = useState("");
	//const price = ethers.parseEther(String(props.value));
	console.log(ethers);
	// debugger;
	const price = ethers.formatEther(String(props.value));
	console.log("price"+price);
	const [ name,setName] = useState("");
	const [ desc,setDesc] = useState("");
	const [ nftimg,setNftimage] = useState("");

	async function getNFTMeta(_tokenId){
		if(!_tokenId)return;

		console.log(_tokenId)
		let nftIpfsHash = "";

		if(_tokenId.length!=59){
			nftIpfsHash = await readContract(config,{
				address: conf.constractAddr,
				abi: conf.constractAbi,
				args:[_tokenId],
				functionName: "tokenURI"
			});
		}else{
			nftIpfsHash = _tokenId;
		}
		console.log(nftIpfsHash)
		let metaData = await fetchDataUrl(nftIpfsHash);
		console.log(metaData)
		let {name,desc,nftimage,price} = JSON.parse(JSON.parse(metaData).content);
		setName(name);
		setDesc(desc);
		setNftimage(nftimage);
		// setPrice(String(price));
	}

	async function fetchDataUrl(ipfsHash){
		const GATEWAY = process.env.REACT_APP_PINATA_GATEWAY;
		const CID = ipfsHash;

		const url = `https://${GATEWAY}/ipfs/${CID}`;
		try {
			const response = await fetch(url);
			console.log(response)
			return response.text();
		} catch (error) {
			console.log(error);
		}
	}

	async function buyNFT(){
		let _tokenId = tokenId;
		console.log(_tokenId)

		// let sendEthValue = ethers.formatUnits(serviceFee, 'ether'); 
		let txResult  = await writeContract(config,{
			address: conf.constractAddr,
			abi: conf.constractAbi,
			functionName: "executeSale",
			args: [_tokenId],   
		    value: ethers.parseEther(price)
		});
		console.log(txResult);
		if(txResult){

		      message.success("NFT购买成功");
		}
		// const transaction = await getTransactionReceipt(config, {
		//   hash: txResult,
		// });
		// console.log(transaction);
	}
	// setId(value.tokenId);
	getNFTMeta(tokenId)

	return ( 
		<Col style={{display:ishidden?"none":""}} span={8}> 
			<Card  actions={displaybuy=="true"?[<DollarTwoTone onClick={buyNFT} key="buy NFT"/>]:[]}  title={name} bordered={false} style={{marginTop:"10px"}} cover={<img src={nftimg} />} heght="200px">
		  		<Meta avatar={<Avatar src="./images/ethereum.png" />}
		      title={price+"ETH"} description={desc}/>
			</Card>
		</Col>
	)
}

export default NFTtile;