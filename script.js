
function showConverter() {
    document.getElementById("calculator").classList.add("fade-out");
    setTimeout(() => {
        document.getElementById("calculator").style.display = "none";
        document.getElementById("converter").style.display = "block";
        document.getElementById("converter").classList.remove("fade-out");
        document.getElementById("converter").classList.add("fade-in");
    }, 500);
}

function showCalculator() {
    document.getElementById("converter").classList.add("fade-out");
    setTimeout(() => {
        document.getElementById("converter").style.display = "none";
        document.getElementById("calculator").style.display = "block";
        document.getElementById("calculator").classList.remove("fade-out");
        document.getElementById("calculator").classList.add("fade-in");
    }, 500);
}

// Função para extrair o ID do produto de diferentes sites
function extractProductId(url) {
    let match;

    // Taobao, 1688 e Weidian
    match = url.match(/id=(\d+)/); // Taobao e variações
    if (match) return match[1];

    match = url.match(/offer\/(\d+)\.html/); // 1688
    if (match) return match[1];

    match = url.match(/item\.html\?itemID=(\d+)/); // Weidian
    if (match) return match[1];

    return null;
}

// Função para converter o link
function convertLink() {
    const originalLink = document.getElementById("originalLink").value;
    const targetPlatform = document.getElementById("platform").value;
    const productId = extractProductId(originalLink);

    if (!productId) {
        alert("Link inválido! Insere um link correto de um dos sites suportados.");
        return;
    }

    let convertedLink = "";
    switch (targetPlatform) {
        case "cssbuy":
            convertedLink = `https://www.cssbuy.com/item-micro-${productId}.html`;
            break;
        case "cnfans":
            convertedLink = `https://cnfans.com/product/?shop_type=weidian&id=${productId}`;
            break;
        case "sugargoo":
            convertedLink = `https://www.sugargoo.com/#/home/productDetail?productLink=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D${productId}`;
            break;
        default:
            alert("Plataforma não suportada.");
            return;
    }

    document.getElementById("convertedLink").innerHTML = `<a href="${convertedLink}" target="_blank">${convertedLink}</a>`;
}

// Função para calcular o preço final do produto
function calculatePrice() {
    const productPrice = parseFloat(document.getElementById("productPrice").value);
    const productWeight = parseFloat(document.getElementById("productWeight").value);

    if (isNaN(productPrice) || isNaN(productWeight) || productPrice <= 0 || productWeight <= 0) {
        alert("Por favor, insere um preço e um peso válidos.");
        return;
    }

    const totalPackageWeight = 8337;
    const totalShippingCost = 122;
    const taxRate = 5;

    const proportionalShippingCost = (productWeight / totalPackageWeight) * totalShippingCost;
    const taxes = (productPrice / 100) * taxRate;
    const finalPrice = productPrice + proportionalShippingCost + taxes;

    document.getElementById("priceBreakdown").innerHTML = `
        <strong>Preço do Produto:</strong> €${productPrice.toFixed(2)}<br>
        <strong>Custo de Envio:</strong> €${proportionalShippingCost.toFixed(2)}<br>
        <strong>Taxas:</strong> €${taxes.toFixed(2)}<br>
        <strong>Preço Final:</strong> <span style="color: green;">€${finalPrice.toFixed(2)}</span>
    `;
}
