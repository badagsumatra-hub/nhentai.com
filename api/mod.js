// api/mod.js
const https = require('https');

// ============================================================
// KONFIGURASI
// ============================================================
// URL Gist untuk Install (menggunakan link terbaru Anda)
const GIST_INSTALL_URL = 'https://gist.githubusercontent.com/badagsumatra-hub/ac68dcdb3163559311c05d2c9af416ef/raw/01d8c37e0a5fbeafbbef54a8d88f0bfb2b495fb1/vantekcrotxxxpornhub.com';

// --- UNINSTALL ---
// ⚠️ URL di bawah ini adalah contoh. GANTI dengan URL Gist uninstall Anda yang asli.
const GIST_UNINSTALL_URL = 'https://gist.githubusercontent.com/badagsumatra-hub/ac68dcdb3163559311c05d2c9af416ef/raw/01d8c37e0a5fbeafbbef54a8d88f0bfb2b495fb1/vantekcrotxxxrule34video.com'; // <-- GANTI INI
// ============================================================

// Fungsi untuk mengambil data dari Gist
function fetchGist(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    reject(new Error(`Gagal mengambil Gist (HTTP ${res.statusCode})`));
                }
            });
            res.on('error', reject);
        }).on('error', reject);
    });
}

// ============================================================
// HANDLER UTAMA VERCEL
// ============================================================
module.exports = async (req, res) => {
    // CORS biar bisa diakses dari mana saja
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    // Ambil parameter 'type' dari query string (contoh: ?type=uninstall)
    const { type } = req.query;

    // Pilih URL Gist berdasarkan tipe
    let targetUrl = GIST_INSTALL_URL; // Default: install
    if (type === 'uninstall') {
        targetUrl = GIST_UNINSTALL_URL;
        console.log('📥 Mode UNINSTALL dipilih.');
    } else {
        console.log('📥 Mode INSTALL dipilih.');
    }

    try {
        console.log(`📡 Mengambil script dari Gist: ${targetUrl}`);
        const scriptContent = await fetchGist(targetUrl);

        if (!scriptContent) {
            throw new Error('Konten Gist kosong.');
        }

        console.log(`✅ Sukses mengambil script (${scriptContent.length} karakter).`);
        res.status(200).send(scriptContent);

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        // Kirim pesan error sebagai komentar shell agar tidak dieksekusi
        res.status(500).send(`# Error: ${error.message}\n# Gagal mengambil script dari server.`);
    }
};
