import { Hono } from 'hono'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

type Bindings = {
  ETH_RPC_URL?: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/:name', async ({ req, env }) => {
  const name = req.param('name')

  // Rough validation
  if (!name || name.length < 4 || !name.includes('.')) {
    return Response.json({ error: 'Invalid ENS name' }, { status: 400 })
  }

  const client = createPublicClient({
    chain: mainnet,
    transport: http(env.ETH_RPC_URL),
  })

  const address = await client.getEnsAddress({ name })

  if (!address) {
    return Response.json({ error: 'Address not found' }, { status: 404 })
  }

  return Response.json({ address })
})

export default app
