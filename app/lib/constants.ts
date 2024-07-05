import * as path from 'path';

interface OrgInfo {
  keyDirectoryPath: string;
  certDirectoryPath: string;
  tlsCertPath: string;
  peerEndpoint: string;
  peerHostAlias: string;
  mspId: string;
}

const channelName = 'mychannel';
const chaincodeName = 'packet';

const org1CryptoPath = path.resolve(
  __dirname,
  '..',
  '..',
  'test-network',
  'organizations',
  'peerOrganizations',
  'org1.example.com',
);
const org2CryptoPath = path.resolve(
  __dirname,
  '..',
  '..',
  'test-network',
  'organizations',
  'peerOrganizations',
  'org2.example.com',
);

const orgInfos: Record<string, OrgInfo> = {
  org1: {
    keyDirectoryPath: path.resolve(
      org1CryptoPath,
      'users',
      'User1@org1.example.com',
      'msp',
      'keystore',
    ),
    certDirectoryPath: path.resolve(
      org1CryptoPath,
      'users',
      'User1@org1.example.com',
      'msp',
      'signcerts',
    ),
    tlsCertPath: path.resolve(
      org1CryptoPath,
      'peers',
      'peer0.org1.example.com',
      'tls',
      'ca.crt',
    ),
    peerEndpoint: 'localhost:7051',
    peerHostAlias: 'peer0.org1.example.com',
    mspId: 'Org1MSP',
  },
  org2: {
    keyDirectoryPath: path.resolve(
      org2CryptoPath,
      'users',
      'User1@org2.example.com',
      'msp',
      'keystore',
    ),
    certDirectoryPath: path.resolve(
      org2CryptoPath,
      'users',
      'User1@org2.example.com',
      'msp',
      'signcerts',
    ),
    tlsCertPath: path.resolve(
      org2CryptoPath,
      'peers',
      'peer0.org2.example.com',
      'tls',
      'ca.crt',
    ),
    peerEndpoint: 'localhost:9051',
    peerHostAlias: 'peer0.org2.example.com',
    mspId: 'Org2MSP',
  },
};

export { channelName, chaincodeName, orgInfos };
