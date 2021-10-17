import { assert } from '@3id/common'
import type { DIDProvider } from 'dids'
import { DID } from 'dids'
import type { AuthProvider, LinkProof } from '@ceramicnetwork/blockchain-utils-linking'
import CeramicClient from '@ceramicnetwork/http-client'
import { IDX } from '@ceramicstudio/idx'
import type { CryptoAccounts } from '@ceramicstudio/idx-constants'
import { hash } from '@stablelib/sha256'
import ThreeIdProvider from '3id-did-provider'
import { fromString } from 'uint8arrays'
import KeyDidResolver from 'key-did-resolver'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { Resolver } from 'did-resolver'
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link'

export type AuthConfig = { authId: string; authSecret: Uint8Array }
export type SeedConfig = { v03ID?: string; seed: Uint8Array, did?:string }

let CERAMIC_API = 'https://ceramic-clay.3boxlabs.com';

export class Manager {
  authProvider: AuthProvider
  idx: IDX
  ceramic: CeramicClient
  threeIdProviders: Record<string, ThreeIdProvider>

  // needs work on wording for "account", did, caip10 etc
  constructor(
    authprovider: AuthProvider,
    opts: { ceramic?: CeramicClient }
  ) {
    this.authProvider = authprovider
    this.ceramic = opts.ceramic || new CeramicClient(CERAMIC_API)
    this.idx = new IDX({ ceramic: this.ceramic })
    this.threeIdProviders = {}
  }

  // Create DID
  async createAccount(): Promise<string> {
    const accountId = (await this.authProvider.accountId()).toString()
    if (this.threeIdProviders[accountId]) return this.threeIdProviders[accountId].id

    const authSecret = await this._authCreate()

    const configId = ({ authSecret, authId: accountId } as AuthConfig)
    assert.isDefined<SeedConfig | AuthConfig>(configId, 'Identity Config to initialize identity')
    const did = await this._initIdentity(configId)

    await this._addLink(did)

    return did
  }

  async _initIdentity(config: AuthConfig | SeedConfig): Promise<string> {
    const getPermission = () => Promise.resolve([])

    const threeIdConfig = Object.assign(config, {
      getPermission,
      ceramic: this.ceramic,
    })

    const threeId = await ThreeIdProvider.create(threeIdConfig)
    this.threeIdProviders[threeId.id] = threeId
    return threeId.id
  }

  async _authCreate(): Promise<Uint8Array> {
    const message = 'Allow this account to control your identity'
    const authSecret = await this.authProvider.authenticate(message)
    const entropy = hash(fromString(authSecret.slice(2)))
    return entropy
  }

  async setDid(did: string): Promise<ThreeIdProvider> {
    const didProvider = this.threeIdProviders[did].getDidProvider()
    const keyDidResolver = KeyDidResolver.getResolver()
    const threeIdResolver = ThreeIdResolver.getResolver(this.ceramic)
    const resolver = new Resolver({
      ...threeIdResolver,
      ...keyDidResolver,
    })
    const didInstance = new DID({ provider: didProvider, resolver: resolver })
    await didInstance.authenticate()
    await this.ceramic.setDID(didInstance)

    return this.threeIdProviders[did]
  }

  // internal for now, until auth/link not strictly required together
  async _addLink(did: string, linkProof?: LinkProof | null): Promise<void> {
    const accountId = await this.authProvider.accountId()
    await this.setDid(did)

    const existing: CryptoAccounts = (await this.idx.get('cryptoAccounts')) || {}
    if (existing && existing[accountId.toString()]) return

    if (!linkProof) {
      linkProof = await this.authProvider.createLink(did)
    }

    const accountLink = await Caip10Link.fromAccount(this.ceramic, accountId, {
      anchor: false,
      publish: false,
    })
    await accountLink.setDidProof(linkProof)
    await this.ceramic.pin.add(accountLink.id)

    const links = Object.assign(existing, { [accountId.toString()]: accountLink.id.toUrl() })
    await this.idx.set('cryptoAccounts', links)
  }

  didProvider(did: string): DIDProvider | undefined {
    return this.threeIdProviders[did]?.getDidProvider() as DIDProvider
  }
}
