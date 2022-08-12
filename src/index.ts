import { ApiPromise, WsProvider } from "@polkadot/api";
import { Extrinsic, Header } from "@polkadot/types/interfaces";
import { decodeSignedTx } from "@substrate/txwrapper-core/lib/core/decode/decodeSignedTx"
import { OptionsWithMeta, TypeRegistry } from "@substrate/txwrapper-core/lib/types";
import metadata from './erc20/metadata'


const main = async () => {
  const provider = new WsProvider("ws://127.0.0.1:9944");
  const api = await ApiPromise.create({ provider });
  await api.rpc.chain.subscribeNewHeads(async (header: Header) => {
    const {
      block: { extrinsics },
    } = await api.rpc.chain.getBlock(header.hash);
    extrinsics
      .filter((e) => e.method.section === "contracts")
      .forEach((extrinsic: Extrinsic) => {
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
        console.log(dataToDecode);

        const metadataRpc = metadata.source.wasm as `0x${string}` // I think this should work 
        const registry: TypeRegistry = new TypeRegistry() // How do I get this value??

        const options: OptionsWithMeta = {
          metadataRpc,
          registry
        }
        // not sure if extrinsics.toString() will work
        decodeSignedTx(extrinsic.toString(), options)
      });
  });
};

main();
