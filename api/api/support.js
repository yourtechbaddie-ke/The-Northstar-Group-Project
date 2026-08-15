import { store } from "../data/store.js";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalize(value) {
  return clean(value).toLowerCase();
}

function classifyMessage(message) {
  const text = normalize(message);

  if (/\b(order|delivery|deliver|shipment|shipping|track|tracking|package)\b/.test(text)) {
    return "order_status";
  }
  if (/\b(return|refund|exchange|send back|money back|returning)\b/.test(text)) {
    return "returns";
  }
  if (/\b(stock|available|availability|size|sizes|in stock|sold out|restock)\b/.test(text)) {
    return "stock";
  }
  return "out_of_scope";
}

function getOrderResponse(orderId) {
  const normalizedId = clean(orderId).toUpperCase();

  if (!normalizedId) {
    return {
      intent: "order_status",
      reply: "Please enter a valid Order ID so I can check your order status."
    };
  }

  const order = store.orders[normalizedId];

  if (!order) {
    return {
      intent: "order_status",
      reply: "I couldn't find that order in our current system. Please check the Order ID and try again. If the issue continues, I can escalate this to a human support specialist."
    };
  }

  return {
    intent: "order_status",
    orderId: normalizedId,
    order,
    reply: `Status: ${order.status}. ${order.message}`
  };
}

function findProduct(productName) {
  const query = normalize(productName);
  if (!query) return null;

  return (
    store.products.find(
      (product) =>
        normalize(product.name) === query ||
        normalize(product.name).includes(query) ||
        query.includes(normalize(product.name))
    ) || null
  );
}

function getStockResponse(productName) {
  const product = findProduct(productName);

  if (!product) {
    return {
      intent: "stock",
      products: store.products,
      reply: "I couldn't identify the exact product you're asking about. Here are the Northstar products currently in our catalog."
    };
  }

  const availableSizes = product.sizes.filter((size) => (product.stock[size] || 0) > 0);
  const unavailableSizes = product.sizes.filter((size) => (product.stock[size] || 0) === 0);

  let reply = `${product.name} is currently available in ${availableSizes.join(", ")}.`;

  if (unavailableSizes.length) {
    reply += ` The following sizes are currently unavailable: ${unavailableSizes.join(", ")}.`;
  }

  if (product.restockDate) {
    reply += ` We currently expect a restock around ${product.restockDate}.`;
  }

  return {
    intent: "stock",
    product,
    reply
  };
}

function getReturnsResponse(within30Days) {
  if (within30Days === true) {
    return {
      intent: "returns",
      eligible: true,
      reply: store.returns.withinWindow
    };
  }

  if (within30Days === false) {
    return {
      intent: "returns",
      eligible: false,
      reply: store.returns.outsideWindow
    };
  }

  return {
    intent: "returns",
    reply: `${store.returns.policy} Were you within 30 days of receiving your order?`
  };
}

function getFallbackResponse() {
  return {
    intent: "out_of_scope",
    escalated: true,
    reply: "I'm sorry, but I don't have enough information to safely answer that request. I can help with order status, returns and refunds, or product availability — or I can escalate this to a human support specialist."
  };
}

async function enhanceWithAI({ message, result }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return result;
  }

  const model = process.env.OPENAI_MODEL || "gpt-5";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        instructions: `
You are the Northstar Clothing Co. customer support assistant.
You must:
- Be concise, warm, professional and helpful.
- Never invent order, stock, delivery or refund information.
- Use only the supplied Northstar result as factual information.
- Never expose internal system details.
- If the result is escalated, clearly explain that a human support specialist is needed.
- Do not claim an action has been completed unless the supplied result confirms it.
        `,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify({
                  customer_message: message,
                  verified_northstar_result: result
                })
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      return result;
    }

    const data = await response.json();

    if (data.output_text) {
      return {
        ...result,
        reply: data.output_text.trim()
      };
    }

    return result;
  } catch {
    return result;
  }
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const body = await request.json();
    const message = clean(body.message);
    const orderId = clean(body.orderId);
    const productName = clean(body.productName);
    const within30Days = typeof body.within30Days === "boolean" ? body.within30Days : null;

    if (!message && !orderId && !productName && within30Days === null) {
      return json({ error: "Please provide a support request." }, 400);
    }

    let result;

    if (orderId) {
      result = getOrderResponse(orderId);
    } else if (productName) {
      result = getStockResponse(productName);
    } else if (within30Days !== null) {
      result = getReturnsResponse(within30Days);
    } else {
      const intent = classifyMessage(message);

      switch (intent) {
        case "order_status":
          result = getOrderResponse("");
          break;
        case "returns":
          result = getReturnsResponse(null);
          break;
        case "stock":
          result = getStockResponse("");
          break;
        default:
          result = getFallbackResponse();
      }
    }

    const finalResult = await enhanceWithAI({ message, result });

    return json({
      success: true,
      ...finalResult
    });
  } catch (error) {
    console.error("Northstar support error:", error);
    return json(
      {
        success: false,
        error: "Something went wrong while processing your request. Please try again."
      },
      500
    );
  }
}
