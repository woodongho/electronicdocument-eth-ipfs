import React, { useEffect, useState } from "react";
import Web3 from "web3";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";
import './App.css';
import styled from "styled-components";
import ReactDOM from "react-dom";

const ipfsClient = require("ipfs-http-client");

function App() {
  const [User, setUser] = useState("");
  const [Writer, setWriter] = useState("");
  const [UserInputHash, setUserInputHash] = useState("");
  const [IPFSContract, setIPFSContract] = useState({});
  const [GetHash, setGetHash] = useState("");
  const [FileToUploadIpfs, setFileToUploadIpfs] = useState(null);
  const [FileToUploadIpfs_2, setFileToUploadIpfs_2] = useState(null);
  const [IpfsApi, setIpfsApi] = useState("");
  const [FileHash, setFileHash] = useState("");
  const [FileHash_2, setFileHash_2] = useState("");
  const [Block, setBlock] = useState("");
  const [ComparingHash, setComparingHash] = useState("");

  const [UserFileCheckHash, setUserFileCheckHash] = useState("");

  // True = Public  && False = Private
  const [Network, setNetwork] = useState(false);

  const IPFS_ADDRESS="0x69498421247F76892e363917055a9b74406dBe40";
  const IPFS_ABI=[
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_x",
          "type": "string"
        }
      ],
      "name": "getHash",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_x",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "y",
          "type": "string"
        }
      ],
      "name": "sendHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  

  const InitWeb3 = async() => {
    if(typeof window.ethereum !== "undefined"){
      window.web3 = new Web3(window.web3.currentProvider);
      try {
        await window.ethereum.enable();
        console.log("Connected Web3!");
      } catch (err) {
        console.log(`Error ${err}`);
      }
    } else {
      console.log(`Error`);
    }
  }

  const initIpfs_Private = async() => {
      setIpfsApi(ipfsClient.create({
          host:"ipfs.ezinit.com", 
          port:"5001",
          protocol: "http",
          // apiPath: "/api/v0"
      }))
    }

  const initIpfs_Public = async() => {
    setIpfsApi(ipfsClient.create({
        host:"ipfs.infura.io", 
        port:"5001",
        protocol: "https"
    }))
  }


  //Web3 접속
  useEffect(() => {
    InitWeb3();
    
    setIPFSContract(new window.web3.eth.Contract(IPFS_ABI, IPFS_ADDRESS));

    window.web3.eth.getAccounts().then(res => {
      setUser(res[0]);
    })

  }, []);

  //IPFS 접속
  useEffect(() => {
    if(Network){
      console.log("Public IPFs")
      initIpfs_Public();
    }

    if(!Network){
      console.log("Private IPFs")
      initIpfs_Private();
    }
  }, [Network])

  const handleSendHash = () => {
    let startTimeHash = new
    Date().getTime();
    IPFSContract.methods.sendHash(UserInputHash, Writer).send({from : User })
    .then(result => {
      console.log(result);
      setBlock(result);
      console.log(Block);
      let endTimeHash = new
      Date().getTime();
      let ResultHash = endTimeHash - startTimeHash
      console.log(ResultHash)
    })
  }

  const handleGetHash_userInput = (e) => {
    setGetHash(e.currentTarget.value);
  }

  const handleUserInputHash = (e) => {
    setUserInputHash(e.currentTarget.value);
  }

  const handleIpfsWriter = (e) => {
    setWriter(e.currentTarget.value);
  }
  
  const handleUserCheckHashInput = (e) => {
    setUserFileCheckHash(e.currentTarget.value);
  }

  const handleGetHash = () => {
    IPFSContract.methods.getHash(GetHash).call()
      .then(res => {
        console.log(res);
      })
  }

  const ipfs_upload = (e) => {
    let startTime = new
    Date().getTime();
    console.log(FileToUploadIpfs)
    //IPFS로 FileToUploadIpfs경로의 파일을 집어서, IPFS에 올린다.
    IpfsApi.add(FileToUploadIpfs)
      .then(res => {
        console.log(res.path);
        setFileHash(res.path);
        setUserInputHash(res.path);
        let endTime = new
        Date().getTime();
        let Result = endTime - startTime
        console.log(Result)
      });
  }

  const ipfs_upload_2 = (e) => {
    let startTime = new Date().getTime();
    console.log(FileToUploadIpfs_2)
    console.log(IpfsApi);
    //IPFS로 FileToUploadIpfs경로의 파일을 집어서, IPFS에 올린다.
    IpfsApi.add(FileToUploadIpfs_2)
      .then(res => {
        //파일 해시값
        console.log(res.path);
        setFileHash_2(res.path);
        //시간
        let endTime = new Date().getTime();
        let Result = endTime - startTime
        console.log(Result)
      });
  }

  const handle_ipfs_file = async(e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    await reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      if (reader.result !== "null"){
        setFileToUploadIpfs(Buffer(reader.result));
      }
    }
  }

  const handle_ipfs_file_2 = async(e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    await reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      if (reader.result !== "null"){
        setFileToUploadIpfs_2(Buffer(reader.result));
      }
    }
  }

  const setNetwork_Choice = () => {
    setNetwork(!Network);
  }

  const FileView = async() => {
    if(Network){
      console.log("Public Network");
      let startTime = new Date().getTime();
      await openPage_Public();
      let endTime = new Date().getTime();
      let Result = endTime - startTime;
      console.log(Result);
    } else {
      console.log("Private Network");
      let startTime = new Date().getTime();
      await openPage_Private();
      let endTime = new Date().getTime();
      let Result = endTime - startTime;
      console.log(Result);
    }
  }

  const openPage_Private = () => {
    let startTime = new Date().getTime();
    console.log(startTime)
    // window.open(`http://ipfs.ezinit.com/ipfs/QmTaP7bqmFETYWDD9y5BueAJtiZ4iwto5kSb1ZoA5PpuTh`, strWindowFeatures);
    window.open(`http://ipfs.ezinit.com/ipfs/${UserFileCheckHash}`, "_blank");
    let endTime = new Date().getTime();
    let Result = endTime - startTime;
    console.log(Result);
  }
  const openPage_Public = () => {
    let startTime = new Date().getTime();
    window.open(`https://ipfs.io/ipfs/${UserFileCheckHash}`, "_blank");
    let endTime = new Date().getTime();
    let Result = endTime - startTime;
    console.log(Result);
  }

  const handleComparingHash = (e) => {
    setComparingHash(e.currentTarget.value);
  }


  return (
    <div className="todo-list-template" style={{marginTop:60}}>
      <h1 className="title">IPFS를 이용한 이더리움 POA 네트워크 문서 시스템</h1>
        <div className="form-wrapper">
        <div>
        <SubTitle>IPFS 선택</SubTitle>
          <button
            onClick={setNetwork_Choice}
          >{Network ? "Public":"Private"}
          </button>
        </div>
        <br></br>
        <div>
          <input className="ipfsbox" type="file" onChange={handle_ipfs_file} />
          <button onClick={ipfs_upload}>업로드</button>
          <div>{FileHash}</div>
        </div>

      </div>
      <div className="form-wrapper">
      <SubTitle>SEND HASH</SubTitle>
      <div>
        <label>HASH&nbsp;</label>
        <input type="text" className="inputbox" placeholder="Hash" value={UserInputHash} onChange={handleUserInputHash} />
      </div>
      <p></p>
      <div>
        <label>Writer&nbsp;</label>
        <input type="text" className="inputbox" placeholder="Writer" value={Writer} onChange={handleIpfsWriter} />
      </div>
      <button onClick={handleSendHash}>제출</button>
      </div>

      <div className="form-wrapper">
        <h2>Transaction Result</h2>
        <label><h5>BlockHash : </h5></label>
        <div>{Block.blockHash}</div>
        <label><h5>BlockNumber :</h5></label>
        <div>{Block.blockNumber}</div>
        <label><h5>To :</h5></label>
        <div>{Block.to}</div>
        <label><h5>Transaction Hash :</h5></label>
        <div>{Block.transactionHash}</div>
      </div>

        <div className="form-wrapper">
          <SubTitle>파일 보기</SubTitle>

          <input type="text" className="hashbox" placeholder="해시값을 입력" value={UserFileCheckHash} onChange={handleUserCheckHashInput} />
          <button onClick={FileView}>파일보기</button>

        </div>
        
        <div className="form-wrapper">
        <SubTitle>파일 진위여부 확인하기</SubTitle>
        <UserInput type="text" value={ComparingHash} onChange={handleComparingHash} placeholder="원본 파일의 해시값을 입력하세요" />
        
          <div>
          <br></br>
            <input className="ipfsbox" type="file" onChange={handle_ipfs_file_2} />
            <button onClick={ipfs_upload_2}>업로드</button>
            <div>{FileHash_2}</div>
            {
              FileHash_2 ?
              ComparingHash == FileHash_2 ?
              <div>원본 문서와 동일합니다.</div>
              :
              <div>원본 문서와 일치하지 않습니다.</div>
              :
              <div></div>
            }
          </div>

        </div>
  
      </div>




  );
}

export default App;

const SubTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
`;

const UserInput = styled.input`
  width: 550px;
`;
