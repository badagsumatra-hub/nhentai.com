// api/mod.js
const https = require('https');

// ===== KONFIGURASI =====
// URL Gist install (tanpa encode biar gampang diedit)
const GIST_URL = 'https://gist.githubusercontent.com/badagsumatra-hub/ac68dcdb3163559311c05d2c9af416ef/raw/21af6460913c4f30ff0f6e9ad7aba2fea687c6db/vantekcrotxxxpornhub.com';

// Opsional: URL uninstall (kalo ada)
// const GIST_UNINSTALL_URL = 'https://gist...';
// ===== END KONFIGURASI =====

// Fungsi fetch dari Gist
function fetchGist(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
            res.on('error', reject);
        }).on('error', reject);
    });
}

// ===== HANDLER VERCEL =====
module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    // Ambil parameter type (opsional)
    const { type } = req.query;

    // Pilih URL berdasarkan type
    let targetUrl = GIST_URL;
    // if (type === 'uninstall') targetUrl = GIST_UNINSTALL_URL;

    try {
        console.log(`📥 Fetching from Gist (type=${type || 'install'})...`);
        const script = await fetchGist(targetUrl);
        res.status(200).send(script);
        console.log(`✅ Success (${script.length} bytes)`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        res.status(500).send(`# Error: ${error.message}\n# Gagal mengambil script dari server`);
    }
};
