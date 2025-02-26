function showConverter() {
    document.getElementById("calculator").style.display = "none";
    document.getElementById("converter").style.display = "block";
}

function showCalculator() {
    document.getElementById("converter").style.display = "none";
    document.getElementById("calculator").style.display = "block";
}

function extractProductId(url) {
    let match;

    // Taobao e Tmall (id=)
    match = url.match(/[?&]id=(\d+)/);
    if (match) return match[1];

    // 1688 (offer ID dentro da URL)
    match = url.match(/offer\/(\d+)\.html/);
    if (match) return match[1];

    // Weidian (itemID dentro da URL)
    match = url.match(/item\.html\?itemID=(\d+)/);
    if (match) return match[1];

    // CNFans (ID dentro da URL)
    match = url.match(/[?&]id=(\d+)/);
    if (match) return match[1];

    // CSSBuy (item-micro-[ID])
    match = url.match(/item-micro-(\d+)/);
    if (match) return match[1];

    // Sugargoo (productLink encoded)
    match = url.match(/productLink=https%3A%2F%2Fdetail\.1688\.com%2Foffer%2F(\d+)\.html/);
    if (match) return match[1];

    return null;
}

function convertLink() {
    const originalLink = document.getElementById("originalLink").value.trim();
    const targetPlatform = document.getElementById("platform").value;
    const productId = extractProductId(originalLink);

    if (!productId) {
        alert("Erro: O link inserido não é válido! Certifica-te de que copiaste corretamente.");
        return;
    }

    let convertedLink = "";
    switch (targetPlatform) {
        case "cssbuy":
            convertedLink = `https://cssbuy.com/item-micro-${productId}.html?promotionCode=1b4237f18fa4421c`;
            break;
        case "cnfans":
            convertedLink = `https://cnfans.com/product/?shop_type=ali_1688&id=${productId}&ref=72365`;
            break;
        case "sugargoo":
            convertedLink = `https://www.sugargoo.com/#/home/productDetail?productLink=https%3A%2F%2Fdetail.1688.com%2Foffer%2F${productId}.html`;
            break;
        case "taobao":
            convertedLink = `https://item.taobao.com/item.htm?id=${productId}`;
            break;
        case "1688":
            convertedLink = `https://detail.1688.com/offer/${productId}.html`;
            break;
        case "weidian":
            convertedLink = `https://weidian.com/item.html?itemID=${productId}`;
            break;
        default:
            alert("Erro: Plataforma não suportada.");
            return;
    }

    document.getElementById("convertedLink").innerHTML = `
        <strong>Link Convertido:</strong> <br>
        <input type="text" id="copyLink" value="${convertedLink}" readonly>
        <button onclick="copyToClipboard()">Copiar</button>
    `;
}

function copyToClipboard() {
    const copyText = document.getElementById("copyLink");
    if (!copyText) {
        alert("Erro: Nenhum link para copiar!");
        return;
    }
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value).then(() => {
        alert("Link copiado!");
    }).catch(err => {
        console.error("Erro ao copiar: ", err);
    });
}

function calculatePrice() {
    const productPrice = parseFloat(document.getElementById("productPrice").value);
    const productWeight = parseFloat(document.getElementById("productWeight").value);
    const includeShipping = document.getElementById("includeShipping").checked;
    const includePhoto = document.getElementById("includePhoto").checked;

    if (isNaN(productPrice) || isNaN(productWeight) || productPrice <= 0 || productWeight <= 0) {
        alert("Por favor, insere um preço e um peso válidos.");
        return;
    }

    const totalPackageWeight = 8337;
    const totalShippingCost = 122;
    const taxRate = 5;
    const shippingCost = includeShipping ? 1.33 : 0;
    const photoCost = includePhoto ? 0.30 : 0;

    let finalWeight = productWeight;
    if (includeShipping) {
        finalWeight += shippingCost;
    }

    const proportionalShippingCost = (finalWeight / totalPackageWeight) * totalShippingCost;
    const taxes = (productPrice / 100) * taxRate;
    const finalPrice = productPrice + proportionalShippingCost + taxes + photoCost;

    document.getElementById("priceBreakdown").innerHTML = `
        <strong>Preço do Produto:</strong> €${productPrice.toFixed(2)}<br>
        <strong>Custo de Envio:</strong> €${proportionalShippingCost.toFixed(2)}<br>
        <strong>Taxas:</strong> €${taxes.toFixed(2)}<br>
        <strong>Custo das Fotos:</strong> €${photoCost.toFixed(2)}<br>
        <strong>Preço Final:</strong> <span style="color: green;">€${finalPrice.toFixed(2)}</span>
    `;
}
