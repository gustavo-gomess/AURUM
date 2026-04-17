import AbacatePay from "abacatepay-nodejs-sdk"

const apiKey = process.env.ABACATEPAY_API_KEY ?? ""

const abacatepay = AbacatePay(apiKey)

export default abacatepay

// Produto para cobrança ONE_TIME via PIX (valor em centavos)
export const AURUM_ANNUAL_PLAN = {
  externalId: "aurum-annual-plan-v1",
  name: "AURUM Nova Escola — Plano Anual",
  quantity: 1,
  price: 46800, // R$ 468,00 = 12 × R$ 39,00
  description: "1 ano de acesso completo à plataforma AURUM Nova Escola",
} as const

// ID do produto criado no dashboard do AbacatePay com ciclo YEARLY
// Necessário para /v2/subscriptions/create
const SUBSCRIPTION_PRODUCT_ID =
  process.env.ABACATEPAY_SUBSCRIPTION_PRODUCT_ID ?? ""

const ABACATEPAY_V2_BASE = "https://api.abacatepay.com/v2"

type SubscriptionCreateParams = {
  productId?: string
  customerId: string
  returnUrl: string
  completionUrl: string
  externalId?: string
  methods?: ("PIX" | "CARD")[]
}

type SubscriptionCreateResponse = {
  success: boolean
  error: string | null
  data: {
    id: string
    url: string
    amount: number
    status: string
    devMode: boolean
  } | null
}

/**
 * Cria uma assinatura recorrente via API v2 do AbacatePay.
 * O SDK v1.6 não expõe esse endpoint, então chamamos diretamente.
 */
export async function createSubscription(
  params: SubscriptionCreateParams
): Promise<SubscriptionCreateResponse> {
  const res = await fetch(`${ABACATEPAY_V2_BASE}/subscriptions/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          id: params.productId || SUBSCRIPTION_PRODUCT_ID,
          quantity: 1,
        },
      ],
      customerId: params.customerId,
      externalId: params.externalId,
      methods: params.methods ?? ["CARD"],
      returnUrl: params.returnUrl,
      completionUrl: params.completionUrl,
    }),
  })

  return res.json()
}
