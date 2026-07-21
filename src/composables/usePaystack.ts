declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackSetupOptions) => { openIframe: () => void }
    }
  }
}

interface PaystackSetupOptions {
  key:       string
  email:     string
  amount:    number
  ref:       string
  currency?: string
  metadata?: Record<string, unknown>
  callback:  (response: { reference: string; status: string; trans: string; transaction: string }) => void
  onClose:   () => void
}

let scriptLoadPromise: Promise<void> | null = null

const loadPaystackScript = (): Promise<void> => {
  if (window.PaystackPop) return Promise.resolve()
  if (scriptLoadPromise) return scriptLoadPromise

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Paystack script — check your network connection.'))
    document.head.appendChild(script)
  })

  return scriptLoadPromise
}

export interface PaystackChargeParams {
  email:     string
  amountNgn: number
  ref:       string
  metadata?: Record<string, unknown>
}

export const usePaystack = () => {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined

  const openPaystackPopup = async (
    params: PaystackChargeParams,
    onSuccess: (reference: string, raw: unknown) => void,
    onCancel: () => void
  ) => {
    if (!publicKey) {
      throw new Error(
        'Paystack public key is missing. Set VITE_PAYSTACK_PUBLIC_KEY in your .env.local.'
      )
    }

    await loadPaystackScript()

    if (!window.PaystackPop) {
      throw new Error('Paystack script loaded but PaystackPop is unavailable. Try again.')
    }

    const handler = window.PaystackPop.setup({
      key:      publicKey,
      email:    params.email,
      amount:   Math.round(params.amountNgn * 100),
      ref:      params.ref,
      currency: 'NGN',
      metadata: params.metadata,
      callback: (response) => { onSuccess(response.reference, response) },
      onClose:  () => { onCancel() },
    })

    handler.openIframe()
  }

  return { openPaystackPopup, isConfigured: !!publicKey }
}