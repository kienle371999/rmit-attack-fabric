import * as grpc from '@grpc/grpc-js';
import {
  connect,
  Gateway,
  Identity,
  Signer,
  signers,
} from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import fs from 'fs';
import * as path from 'path';
import { orgInfos } from './constants';

async function newGrpcConnection(
  tlsCertPath: string,
  peerEndpoint: string,
  peerHostAlias: string,
): Promise<grpc.Client> {
  const tlsRootCert = await fs.promises.readFile(tlsCertPath);
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  return new grpc.Client(peerEndpoint, tlsCredentials, {
    'grpc.ssl_target_name_override': peerHostAlias,
    'grpc.max_receive_message_length': 10000000000,
  });
}

async function newIdentity(
  mspId: string,
  certDirectoryPath: string,
): Promise<Identity> {
  const certPath = await getFirstDirFileName(certDirectoryPath);
  const credentials = await fs.promises.readFile(certPath);
  return { mspId, credentials };
}

async function getFirstDirFileName(dirPath: string): Promise<string> {
  const files = await fs.promises.readdir(dirPath);
  return path.join(dirPath, files[0]);
}

async function newSigner(keyDirectoryPath: string): Promise<Signer> {
  const keyPath = await getFirstDirFileName(keyDirectoryPath);
  const privateKeyPem = await fs.promises.readFile(keyPath);
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  return signers.newPrivateKeySigner(privateKey);
}

async function getGateway(org: string): Promise<Gateway> {
  if (!orgInfos[org]) {
    throw new Error('This organization is not found');
  }

  const {
    keyDirectoryPath,
    certDirectoryPath,
    tlsCertPath,
    peerEndpoint,
    peerHostAlias,
    mspId,
  } = orgInfos[org];

  // The gRPC client connection should be shared by all Gateway connections to this endpoint.
  const client = await newGrpcConnection(
    tlsCertPath,
    peerEndpoint,
    peerHostAlias,
  );

  const gateway = connect({
    client,
    identity: await newIdentity(mspId, certDirectoryPath),
    signer: await newSigner(keyDirectoryPath),
    evaluateOptions: () => {
      return { deadline: Date.now() + 5000 };
    },
    endorseOptions: () => {
      return { deadline: Date.now() + 15000 };
    },
    submitOptions: () => {
      return { deadline: Date.now() + 5000 };
    },
    commitStatusOptions: () => {
      return { deadline: Date.now() + 60000 };
    },
  });

  return gateway;
}

export { getGateway };
