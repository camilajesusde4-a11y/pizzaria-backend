import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const CLIENT_ID = "live_e9fc5eb37ac903427f1099e4d1d5db3d";
const CLIENT_SECRET = "sk_90a355f30b993e134693c7b40e32052bf77eb2733a853ceb990e0e5261f7fdf6";

app.post("/criar-pix", async (req, res) => {
  try {
    const { amount, payerName, payerDocument } = req.body;

    const response = await fetch(
      "https://api-connectmdcpay.squareweb.app/api/v1/deposit",
      {
        method: "POST",
        headers: {
          "x-client-id": CLIENT_ID,
          "x-client-secret": CLIENT_SECRET,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          description: "Pedido Pizzaria",
          payerName,
          payerDocument,
        }),
      }
    );

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao gerar pix" });
  }
});

app.get("/verificar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      "https://api-connectmdcpay.squareweb.app/api/transactions/check",
      {
        method: "POST",
        headers: {
          "x-client-id": CLIENT_ID,
          "x-client-secret": CLIENT_SECRET,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: id,
        }),
      }
    );

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao verificar pagamento" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));