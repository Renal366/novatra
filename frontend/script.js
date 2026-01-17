// ========== KONFIGURASI ==========
// PASTIKAN INI DITULIS, BUKAN HANYA COMMENT!
const API_URL = 'https://novatra.vercel.app/api';

// ========== TAB HANDLER ==========
document.getElementById('tabSignup').addEventListener('click', () => {
    document.getElementById('tabSignup').className = 'tab active';
    document.getElementById('tabLogin').className = 'tab inactive';
    document.getElementById('mainBtn').innerText = 'Sign up';
    document.getElementById('mainBtn').className = 'btn-signup'; // optional styling
});

document.getElementById('tabLogin').addEventListener('click', () => {
    document.getElementById('tabLogin').className = 'tab active';
    document.getElementById('tabSignup').className = 'tab inactive';
    document.getElementById('mainBtn').innerText = 'Login';
    document.getElementById('mainBtn').className = 'btn-login'; // optional styling
});

// ========== SUBMIT HANDLER ==========
document.getElementById('mainBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const mode = document.getElementById('mainBtn').innerText.toLowerCase();
    
    console.log('Attempting:', { email, mode });
    
    // Validasi input
    if (!email || !password) {
        alert('Email dan password harus diisi!');
        return;
    }
    
    // Tentukan endpoint
    const endpoint = mode === 'sign up' ? 'register' : 'login';
    
    try {
        console.log(`Sending request to: ${API_URL}/${endpoint}`);
        
        const res = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                email, 
                password,
                // Tambah no_telepon untuk register jika diperlukan
                ...(endpoint === 'register' && { no_telepon: '08123456789' })
            })
        });
        
        console.log('Response status:', res.status);
        
        // Cek jika response bukan JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            console.error('Non-JSON response:', text);
            throw new Error(`Server error: ${res.status} ${text.substring(0, 100)}`);
        }
        
        const data = await res.json();
        console.log('Response data:', data);
        
        if (data.success) {
            alert(`✅ ${mode.toUpperCase()} BERHASIL!`);
            
            if (endpoint === 'login') {
                // Simpan data user
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('id_user', data.user.id_user);
                } else if (data.id_user) {
                    localStorage.setItem('id_user', data.id_user);
                }
                
                // Redirect setelah 1 detik
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                // Jika register berhasil, reset form atau switch ke login
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
                
                // Auto-switch ke login tab
                document.getElementById('tabLogin').click();
                alert('🎉 Akun berhasil dibuat! Silakan login.');
            }
            
        } else {
            alert(`❌ Gagal: ${data.message || 'Cek data Anda!'}`);
        }
        
    } catch (err) {
        console.error('Fetch error:', err);
        
        // Pesan error yang lebih spesifik
        if (err.message.includes('Failed to fetch')) {
            alert('🌐 Gagal terhubung ke server. Cek koneksi internet atau server mungkin down.');
        } else if (err.message.includes('Server error: 500')) {
            alert('⚙️ Server sedang mengalami masalah. Coba lagi nanti.');
        } else {
            alert(`⚠️ Error: ${err.message}`);
        }
    }
});

// ========== ENTER KEY SUPPORT ==========
document.getElementById('password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('mainBtn').click();
    }
});
