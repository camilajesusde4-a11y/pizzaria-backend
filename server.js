import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const CLIENT_ID = "COLOQUE_SEU_CLIENT_ID_AQUI";
const CLIENT_SECRET = "COLOQUE_SEU_CLIENT_SECRET_AQUI";

app.post("/criar-pix", async (req, res) => {
  const { valor, nome } = req.body;

  try {
    const response = await fetch("https://api-connectmdcpay.squareweb.app/api/v1/deposit", {
      method: "POST",
      headers: {
        "x-client-id": live_4f688e7427cbd490a10fbd7222e8076a,
        "x-client-secret": sk_1538af5b25f64c620ba439d954d3a72ea5964234b7495be10cc4451a2c8cf1c9,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: valor,
        description: "Pedido pizzaria",
        payerName: nome || "Cliente",
        payerDocument: "12345678900"
      })
    });

    const data = await response.json();

    res.json({
      qr_code: data.copyPaste,
      qr_code_base64: data.qrcodeUrl.replace("base64:", ""),
      transactionId: data.transactionId
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Erro ao gerar Pix" });
  }
});

app.get("/verificar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await fetch("https://api-connectmdcpay.squareweb.app/api/transactions/check", {
      method: "POST",
      headers: {
        "x-client-id": CLIENT_ID,
        "x-client-secret": CLIENT_SECRET,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        transactionId: id
      })
    });

    const data = await response.json();

    res.json({
      status: data.transaction.transactionState
    });

  } catch (e) {
    res.status(500).json({ erro: true });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));