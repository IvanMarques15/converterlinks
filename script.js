// Função para extrair o ID do produto
function extractProductId(url) {
    let match = url.match(/id=(\d+)/); // Taobao
    if (match) return match[1];

    match = url.match(/item\.htm\?id=(\d+)/); // Taobao (variação)
    if (match) return match[1];

    match = url.match(/offer\/(\d+)\.html/); // 1688
    if (match) return match[1];

    match = url.match(/item-(1688|taobao|micro)-(\d+)\.html/); // CSSBuy
    if (match) return match[2];

    match = url.match(/item\/offer\/(\d+)/); // 1688 (variação)
    if (match) return match[1];

    match = url.match(/product\/?\?shop_type=\w+&id=(\d+)/); // CNFans
    if (match) return match[1];

    match = url.match(/item\.html\?itemID=(\d+)/); // Weidian
    if (match) return match[1];

    match = url.match(/productDetail\?productLink=.*itemID%3D(\d+)/); // Sugargoo (novo)
    if (match) return match[1];

    return null;
}

// Função para detetar a plataforma do link
function detectPlatform(url) {
    if (url.includes("cssbuy.com")) return "cssbuy";
    if (url.includes("cnfans.com")) return "cnfans";
    if (url.includes("sugargoo.com")) return "sugargoo";
    if (url.includes("taobao.com")) return "taobao";
    if (url.includes("1688.com")) return "1688";
    if (url.includes("weidian.com")) return "weidian";
    return "unknown";
}

// Função para converter o link
function convertLink() {
    const originalLink = document.getElementById("originalLink").value;
    const targetPlatform = document.getElementById("platform").value;
    const sourcePlatform = detectPlatform(originalLink);
    const productId = extractProductId(originalLink);

    const cssbuyRef = "1b4237f18fa4421c";  // Referência personalizada para CSSBuy
    const cnfansRef = "2591009";            // Referência personalizada para CNFans
    const sugargooMemberId = "1973311316715476801";  // Referência personalizada para Sugargoo

    if (!productId) {
        alert("Link inválido! Insere um link correto do Taobao, 1688, Weidian, Sugargoo ou de plataformas suportadas.");
        return;
    }

    let convertedLink = "";
    switch (targetPlatform) {
        case "cssbuy":
            convertedLink = `https://www.cssbuy.com/item-micro-${productId}.html?promotionCode=${cssbuyRef}`;
            break;
        case "cnfans":
            convertedLink = `https://cnfans.com/product/?shop_type=weidian&id=${productId}&ref=${cnfansRef}`;
            break;
        case "sugargoo":
            convertedLink = `https://www.sugargoo.com/#/home/productDetail?productLink=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D${productId}&memberId=${sugargooMemberId}`;
            break;
        default:
            alert("Plataforma não suportada.");
            return;
    }

    document.getElementById("convertedLink").innerHTML = `
        <div class="link-box">
            <a href="${convertedLink}" target="_blank">${convertedLink}</a>
            <button onclick="copyToClipboard('${convertedLink}')" class="copy-button">Copiar</button>
        </div>
    `;
}

// Função para copiar o link convertido
function copyToClipboard(link) {
    navigator.clipboard.writeText(link).then(() => {
        alert("Link copiado para a área de transferência!");
    }, () => {
        alert("Falha ao copiar o link.");
    });
}
