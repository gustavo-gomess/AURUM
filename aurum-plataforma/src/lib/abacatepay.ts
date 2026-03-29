import AbacatePay from "abacatepay-nodejs-sdk"

// Singleton — reutiliza o mesmo cliente em toda a aplicação
const abacatepay = AbacatePay(process.env.ABACATEPAY_API_KEY ?? "")

export default abacatepay

// Produto único da AURUM (valor em centavos)
export const AURUM_ANNUAL_PLAN = {
  externalId: "aurum-annual-plan-v1",
  name: "AURUM Nova Escola — Plano Anual",
  quantity: 1,
  price: 46800, // R$ 468,00 = 12 × R$ 39,00
  description: "1 ano de acesso completo à plataforma AURUM Nova Escola",
} as const
