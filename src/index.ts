import { ApiPromise, WsProvider } from "@polkadot/api";
import { hexToU8a } from "@polkadot/util";
//import { decodeSignedTx } from "@substrate/txwrapper-core/lib/core/decode/decodeSignedTx"
import {
  DecodedSignedTx,
  OptionsWithMeta,
  TypeRegistry,
} from "@substrate/txwrapper-core/lib/types";
import { createMetadata, toTxMethod } from "@substrate/txwrapper-core";

const main = async () => {
  const provider = new WsProvider("ws://127.0.0.1:9944");
  const api = await ApiPromise.create({ provider });
  const options: OptionsWithMeta = {
    metadataRpc: api.runtimeMetadata.toHex(),
    registry: api.registry as unknown as TypeRegistry,
  };
  await api.rpc.chain.subscribeNewHeads(async (header) => {
    const {
      block: { extrinsics },
    } = await api.rpc.chain.getBlock(header.hash);
    extrinsics
      .filter((e) => e.method.section === "contracts")
      .forEach((extrinsic) => {
        try {
          /* args: {
              dest: [Object],
              value: '0',
              gas_limit: '75,000,000,001',
              storage_deposit_limit: null,
              data: '0x0b396f18d43593c715fdd31c61......'
            },
          */
          // At least for this example, data is on index 4
          const dataToDecode = extrinsic.method.args[4].toHuman();
          console.log("TO DECODE: %j", dataToDecode);

          const decoded = decodeSignedTx(extrinsic.toJSON(), options);
          console.log("DECODED: %j", decoded)
          // not sure if extrinsics.toString() will work
          //decodeSignedTx(extrinsic.toString(), options);
        } catch (error) {
          console.log(error);
        }
      });
  });
};

function decodeSignedTx(
  signedTx: string,
  options: OptionsWithMeta
): DecodedSignedTx {
  const { metadataRpc, registry, asCallsOnlyArg, asSpecifiedCallsOnlyV14 } =
    options;

  console.log("1");
  registry.setMetadata(
    createMetadata(
      registry,
      metadataRpc,
      asCallsOnlyArg,
      asSpecifiedCallsOnlyV14
    )
  );
  console.log("2");
  const tx = registry.createType("Extrinsic", hexToU8a(signedTx), {
    isSigned: true,
  });
  console.log("TX %j", tx);
  console.log("\nARGS: %j", { args: tx.method.args})
  console.log("\nTYPES: %j", { args: tx.method.argsDef})
  const methodCall = registry.createType("Call", tx.method);
  // Here is where I guess the decoding should be happening
  const method = toTxMethod(registry, methodCall);
  
  console.log("\nMETHOD %j", method);
  return {
    address: tx.signer.toString(),
    eraPeriod: tx.era.asMortalEra.period.toNumber(),
    metadataRpc: '0x', // hardcoding this because it is too long 
    method,
    nonce: tx.nonce.toNumber(),
    tip: tx.tip.toNumber(),
  };
}

main();
