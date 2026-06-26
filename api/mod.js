// api/mod.js
const https = require('https');

// ============================================================
// KONFIGURASI - URL GIST INSTALL, UNINSTALL, & OPTIMIZER
// ============================================================
const GIST_INSTALL_URL = 'https://gist.githubusercontent.com/badagsumatra-hub/ac68dcdb3163559311c05d2c9af416ef/raw/eaa1bddf6cdf8f888b9b1449460e2a42f2add51f/vantekcrotxxxpornhub.com';

const GIST_UNINSTALL_URL = 'https://gist.githubusercontent.com/badagsumatra-hub/ac68dcdb3163559311c05d2c9af416ef/raw/eaa1bddf6cdf8f888b9b1449460e2a42f2add51f/vantekcrotxxxrule34video.com';

// ⚠️ GANTI URL INI DENGAN GIST OPTIMIZER YANG SEBENARNYA
const GIST_OPTIMIZER_URL = 'https://gist.githubusercontent.com/badagsumatra-hub/ac68dcdb3163559311c05d2c9af416ef/raw/22f676bac2b932bca9c95355671c50d52503fe7e/optimizer';
// ============================================================

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

// ============================================================
// HANDLER VERCEL
// ============================================================
module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    // Ambil parameter type dari query
    const { type } = req.query;

    // Pilih URL Gist berdasarkan type
    let targetUrl;
    let modeName;

    switch (type) {
        case 'uninstall':
            targetUrl = GIST_UNINSTALL_URL;
            modeName = 'UNINSTALL';
            break;
        case 'optimizer':
            targetUrl = GIST_OPTIMIZER_URL;
            modeName = 'OPTIMIZER';
            break;
        case 'install':
        default:
            targetUrl = GIST_INSTALL_URL;
            modeName = 'INSTALL';
            break;
    }

    console.log(`📥 Mode ${modeName} - Fetching dari Gist: ${targetUrl}`);

    try {
        const script = await fetchGist(targetUrl);
        
        if (!script) {
            throw new Error('Konten Gist kosong');
        }

        console.log(`✅ Success (${script.length} bytes)`);
        res.status(200).send(script);

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        res.status(500).send(`# Error: ${error.message}\n# Gagal mengambil script dari Gist`);
    }
};
