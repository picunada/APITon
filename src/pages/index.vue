<script setup lang="ts" generic="T extends any, O extends any">
import type { Ref } from '@vue/reactivity'
import QrcodeVue from 'qrcode.vue'
import { connector } from '~/connector'
import type { WalletApp } from '~/types/wallet'

defineOptions({
  name: 'IndexPage',
})

const wallets: Ref<WalletApp[] | undefined> = ref<WalletApp[]>()
const walletRefs: Ref<HTMLButtonElement[] | undefined> = ref()
const connectionUrl: Ref<string | undefined> = ref()

const connectWallet = (wallet: WalletApp) => {
  if (walletRefs.value !== undefined) {
    walletRefs.value.forEach((button: HTMLButtonElement) => {
      if (wallet.name === button.textContent?.trim()) {
        if (wallet.embedded || wallet.injected)
          connector.connect({ jsBridgeKey: wallet.jsBridgeKey })
      }
      else if (wallet.bridgeUrl) {
        connectionUrl.value = connector.connect({
          universalLink: wallet.universalLink,
          bridgeUrl: wallet.bridgeUrl,
        })
        console.log(connectionUrl.value)
      }
    })
  }
}

onMounted(async () => {
  wallets.value = await connector.getWallets() as WalletApp[]
  console.log(wallets.value)

  connector.onStatusChange(
    (walletInfo) => {
      console.log('Connection status:', walletInfo)
    },
  )
})
</script>

<template>
  <div>
    <div i-carbon-campsite text-4xl inline-block />
    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse-lite" target="_blank">
        Vitesse Lite
      </a>
    </p>
    <p>
      <em text-sm op75>API Billing service</em>
    </p>
    <div py-4 />
    <div v-if="wallets !== undefined" flex flex-row gap-2 items-center justify-center>
      <button v-for="wallet in wallets" :key="wallet.name" ref="walletRefs" :disabled="!wallet.bridgeUrl && !(wallet.embedded || wallet.injected)" btn flex items-center font-bold transition-300 :class="wallet.embedded === true ?? 'featured' " @click="connectWallet(wallet)">
        {{ wallet.name }}
        <div v-if="wallet.embedded" i-material-symbols:check-circle-rounded font-bold p-0 />
      </button>
    </div>
    <div v-if="connectionUrl" flex items-center justify-center p4>
      <QrcodeVue :value="connectionUrl" :size="500" level="H" :margin="4" foreground="#0ea5e9" rounded-10 />
    </div>
  </div>
</template>
