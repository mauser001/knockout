import { Injectable } from '@angular/core';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { Chain, GetAccountResult, InjectedConnector, PublicClient, WalletClient, configureChains, createConfig, waitForTransaction } from '@wagmi/core'
import { arbitrumNova, polygonMumbai } from '@wagmi/core/chains'
import { MetaMaskConnector } from '@wagmi/connectors/metaMask'
import { BehaviorSubject } from 'rxjs';
import { environment } from 'environment';
import { Abi, Address, WriteContractParameters } from 'viem';
import { ABI_BET, ABI_KNOCKOUT } from 'src/abis';
import { DebuggingService } from './debugging.service';

@Injectable({
  providedIn: 'root'
})
export class Web3ConnectService {
  private web3Modal?: Web3Modal
  private ethereumClient?: EthereumClient
  isConnecting$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isConnected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  address$: BehaviorSubject<string> = new BehaviorSubject("")
  nativeCurrency$: BehaviorSubject<string> = new BehaviorSubject("Ether")

  constructor(private deb: DebuggingService) {
    this.init();
  }

  async init() {
    const chains = environment.chainId === arbitrumNova.id.toString() ? [arbitrumNova] : [polygonMumbai]
    const projectId = environment.walletConnectId

    const { publicClient } = configureChains([...chains], [w3mProvider({ projectId })])
    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors: [...w3mConnectors({ projectId, chains }),
      new MetaMaskConnector({ chains }),
      new InjectedConnector({
        chains,
        options: {
          name: 'Injected',
          shimDisconnect: true,
        },
      }),],
      publicClient
    })
    this.ethereumClient = new EthereumClient(wagmiConfig, chains)
    this.web3Modal = new Web3Modal({ projectId }, this.ethereumClient)
    this.ethereumClient.watchAccount<PublicClient>(this.accountChanged)
    this.web3Modal.subscribeModal(({ open }) => !open && this.isConnecting$.next(false))
    this.accountChanged(this.ethereumClient.getAccount())
  }

  private accountChanged = async (data: GetAccountResult<PublicClient>) => {
    const chainId = (await data.connector?.getChainId());
    this.deb.logInfo("Web3 account changed", { address: data.address, isConnected: data.isConnected, isConnecting: data.isConnecting, chainId });
    if (!chainId) {
      return;
    }
    this.address$.next(data.address || "")
    this.isConnected$.next(data.isConnected)
    this.isConnecting$.next(data.isConnecting)
    const newNativeCurrency = this.getChain()?.nativeCurrency?.name || "Ether";
    if (newNativeCurrency && this.nativeCurrency$.getValue() != newNativeCurrency) {
      this.nativeCurrency$.next(newNativeCurrency);
    }
  }

  openModal() {
    this.web3Modal?.openModal()
  }

  getChain = (): Chain | undefined => {
    return this.ethereumClient?.chains.find((chain) => chain.id.toString() === environment.chainId)
  }

  getClient = async (): Promise<WalletClient | undefined> => {
    let client: WalletClient | undefined
    try {
      const conector = this.ethereumClient?.getAccount()?.connector || this.ethereumClient?.getConnectors()?.find(async (con) => {
        const chainId = await con.getChainId()
        return (chainId).toString() === environment.chainId
      })
      client = await conector?.getWalletClient()
      if (!client) {
        this.deb.logWarning("No client found for conector", conector);
      }
    } catch (err) {
      this.deb.logError("Error getting client", err);
    }
    return client
  }

  writeContract = async (functionName: string, args?: Array<unknown>, isTournamentContract = true, amount: bigint | undefined = undefined) => {
    try {
      let client = await this.getClient();
      if (!client) {
        throw new Error("no client for network");

      }
      let chain = this.getChain();
      if (!chain) {
        throw new Error("chain not found");
      }

      let params: WriteContractParameters = {
        chain,
        abi: (isTournamentContract ? ABI_KNOCKOUT.abi : ABI_BET.abi) as Abi,
        address: (isTournamentContract ? environment.knockOutContract : environment.betContract) as Address,
        functionName,
        value: amount,
        account: this.address$.getValue() as Address,
        args
      }
      const hash = await client.writeContract(params);
      await waitForTransaction({ hash })
    } catch (err: any) {
      throw err;
    }
  }
}
