
// import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import { Col, Divider, Row, Button ,Space,Input,Upload,message,Image, Spin,Flex} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from "react";
import { PinataSDK } from "pinata-web3"
import Navbar from "./Navbar";
import { ethers } from 'ethers';
import {conf} from "../conf.js";
import {config} from "../wagmiconf.js";
import { useAccount,useWriteContract } from 'wagmi'
import { readContract,writeContract ,simulateContract,getAccount} from '@wagmi/core'
import { getTransaction,getTransactionReceipt } from '@wagmi/core'
import NFTtile from "./NFTtile";


// console.log(conf)
// console.log(config)

function SellNFT(){
	const [messageApi, contextHolder] = message.useMessage();
	// console.log( process.env)
	const JWT = process.env.REACT_APP_JWT;
	const gateWay =process.env.REACT_APP_PINATAGATEWAY
	const pinata = new PinataSDK({
	  pinataJwt:  JWT,
	  pinataGateway: gateWay,
	});
	
	const [spinning, setSpinning] = React.useState(false);


	const [NFTURL,setNFTURL] = useState("");
	const [nftname,setNftname] = useState("");
	const [nftdesc,setNftdesc] = useState("");
	const [nftprice,setNftprice] = useState("1");
	const [ipfsHash,setIpfsHash] = useState("");
	const [tokenIpfsHashObj,setTokenIpfsHashObj] = useState("");
	const [nftIpfsHash,setNftIpfsHash] = useState("");
	
	// const setNftname = function(ev){
	// 	console.log(ev);
	// }
	const props = {
		name: 'file',
		action: gateWay,
		method: "POST",
		headers:{
			Authorization: `Bearer ${JWT}`
		},
		maxCount:1,
		async onChange(info):function {
			// debugger;
			setSpinning(true);
			console.log(info)
		    if (info.file.status !== 'uploading') {
		      console.log(info.file, info.fileList);
		    }
		    if (info.file.status === 'done') {
		      message.success(`${info.file.name} 文件上传成功`);
		      fetchImageUrl(info.file.response.IpfsHash);

			  setIpfsHash(info.file.response.IpfsHash);
		      /*
				IpfsHash: "QmU4K4nHNtmMMkiXAq3d9kH8pqh3nPpkDP5KiQVcwHye4v"
				PinSize: 28071
				Timestamp: "2024-10-16T05:26:59.591Z"
				isDuplicate: true
		      */
		    } else if (info.file.status === 'error') {
		      message.error(`${info.file.name} 文件上传失败`);
		    }

			setSpinning(false);
		},
		progress: {
			strokeColor: {
				'0%': '#108ee9',
				'100%': '#87d068',
			},
			strokeWidth: 3,
			format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
		}
	};

	async function fetchImageUrl(ipfsHash){
		const GATEWAY = process.env.REACT_APP_PINATA_GATEWAY;
		const CID = ipfsHash;
		setSpinning(true);


		const url = `https://${GATEWAY}/ipfs/${CID}`;
		try {
			const response = await fetch(url);
			console.log(response);
			// var blob = new Blob([response.blob()], { type: "png" });
			// const imageURL = URL.createObjectURL(blob);
			setNFTURL(response.url);
		} catch (error) {
			console.log(error);
		}
		setSpinning(false);
	}

	async function uploadMetadataToIPFS(){

		setSpinning(true);
		if(!nftname||!nftdesc||!nftprice||!NFTURL){
			message.error("NFT数据填写不完整");
			setSpinning(false);
			return;

		}
		const upload = await pinata.upload.json({
			content: JSON.stringify({
				name:nftname,
				desc:nftdesc,
				price:nftprice,
				nftimage:NFTURL
			}),
			name: "",
			lang: "js"
		});
		console.log(upload)
		setSpinning(false);

		return upload&&upload.IpfsHash;
	}

	async function publishNFT(){
		setSpinning(true);
		let nftIpfsHash = await uploadMetadataToIPFS();
		if(!nftIpfsHash)return;
		console.log(nftIpfsHash);
		setNftIpfsHash(nftIpfsHash);
		let serviceFee = await readContract(config,{
			address: conf.constractAddr,
			abi: conf.constractAbi,
			functionName: "getListPrice"
		});
		console.log("serviceList服务费 : "+serviceFee)
		// console.log(ethers)
		//wei单位转化为eth单位
		let sendEthValue = ethers.formatUnits(serviceFee, 'ether'); 
		let txResult  = await writeContract(config,{
			address: conf.constractAddr,
			abi: conf.constractAbi,
			functionName: "createToken",
			args: [nftprice, nftIpfsHash],   
		    value: ethers.parseEther(sendEthValue)// 发送 0.1 ETH   
		});
		console.log(txResult);
		
		const transaction = await getTransactionReceipt(config, {
		  hash: txResult,
		});
		console.log(transaction);
		setSpinning(false);
		message.success("数据已上链, 交易哈希：" + transaction.transactionHash);

	    // const index = receipt.events[0].args[0].toNumber();
	    // console.log(`Generated Index: ${index}`);

		// setNftname("sdfs")
		// setNftdesc("aaaa")
		// setNftprice(100)
		setTokenIpfsHashObj({
			tokenId:nftIpfsHash
		})
		
	}
	return (<div>
      		<Spin spinning={spinning}  fullscreen  size="large" />
			<Navbar></Navbar>
			<Divider orientation="left">
				    <Input placeholder="NFT名字" value={nftname} onChange={(e) => setNftname(e.target.value)} />
			</Divider>
			<Divider orientation="left">
				    <Input placeholder="NFT描述" value={nftdesc} onChange={(e) => setNftdesc(e.target.value)} />
			</Divider>
			<Divider orientation="left">
				    <Input placeholder="NFT价格"  suffix="ETH" value={nftprice} onChange={(e) => setNftprice(e.target.value)} />
			</Divider>
			<Divider orientation="left">
				<Image width={100}
					src={NFTURL}
				/>
			</Divider>
			<Divider orientation="left">
				    <b>ipfsHash : </b>{ipfsHash}
			</Divider>

			<Row gutter={16}>
				<Col className="gutter-row" span={6}>
					<Upload {...props}>
						<Button icon={<UploadOutlined />}>上传</Button>
					</Upload>
				</Col>
			</Row>

			<Divider orientation="left">
				<Button onClick={publishNFT} type="primary">发布NFT</Button>
			</Divider>
			    <Flex justify="center">

					{tokenIpfsHashObj==""?"":<NFTtile key="" value={tokenIpfsHashObj}  displaybuy="false"></NFTtile>}
				</Flex>

			<Divider orientation="left">
				    
			</Divider>
	</div>)
}

export default SellNFT