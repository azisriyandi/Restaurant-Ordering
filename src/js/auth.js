// ---------- Daftar ----------
const registerForm = document.querySelector('#register-form');

registerForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const data = new FormData(registerForm);
    const full_name = data.get('full_name');
    const email = data.get('email');
    const password = data.get('password');

    const msg = registerForm.querySelector('.msg');
    const button = registerForm.querySelector('button');

    button.disabled = true;
    msg.hidden = true;

    const { error } = await db.auth.signUp({
        email,
        password,
        options: { data: { full_name } }
    });

    if (error) {
        msg.textContent = error.message;
        msg.className = 'msg';
    } else {
        msg.textContent = 'Akun dibuat! Cek email untuk konfirmasi.';
        msg.className = 'msg ok';
        registerForm.reset();
    }

    msg.hidden = false;
    button.disabled = false;
});

// ---------- Masuk ----------
const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const data = new FormData(loginForm);
    const email = data.get('email');
    const password = data.get('password');

    const msg = loginForm.querySelector('.msg');
    const button = loginForm.querySelector('button[type=submit]');

    button.disabled = true;
    msg.hidden = true;

    const { error } = await db.auth.signInWithPassword({ email, password });

    if (error) {
        msg.textContent = error.message;
        msg.className = 'msg';
        msg.hidden = false;
    }

    button.disabled = false;
});

// ---------- Tampilan dan status login ----------
const authView = document.querySelector('#auth-view');
const resetView = document.querySelector('#reset-view');

let recovering = false;

db.auth.onAuthStateChange((event, session) => {
    console.log(event);

    if (event === 'PASSWORD_RECOVERY') recovering = true;

    if (recovering) {
        authView.hidden = true;
        resetView.hidden = false;
        return;
    }

    if (session) {
        window.location.href = 'index.html';
        return;
    }

    resetView.hidden = true;
    authView.hidden = false;
});

// ---------- Lupa password ----------
const forgotForm = document.querySelector('#forgot-form');

document.querySelector('#forgot-link').addEventListener('click', () => {
    loginForm.hidden = true;
    forgotForm.hidden = false;
});

document.querySelector('#back-link').addEventListener('click', () => {
    forgotForm.hidden = true;
    loginForm.hidden = false;
});

forgotForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = new FormData(forgotForm).get('email');
    const msg = forgotForm.querySelector('.msg');
    const button = forgotForm.querySelector('button[type=submit]');

    button.disabled = true;
    msg.hidden = true;

    const { error } = await db.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
    });

    if (error) {
        msg.textContent = error.message;
        msg.className = 'msg';
    } else {
        msg.textContent = 'Link reset dikirim. Cek email kamu.';
        msg.className = 'msg ok';
    }

    msg.hidden = false;
    button.disabled = false;
});

// ---------- Password baru (setelah klik link di email) ----------
const resetForm = document.querySelector('#reset-form');

resetForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const password = new FormData(resetForm).get('password');
    const msg = resetForm.querySelector('.msg');
    const button = resetForm.querySelector('button');

    button.disabled = true;
    msg.hidden = true;

    const { error } = await db.auth.updateUser({ password });

    if (error) {
        msg.textContent = error.message;
        msg.className = 'msg';
        msg.hidden = false;
        button.disabled = false;
        return;
    }

    msg.textContent = 'Password diperbarui!';
    msg.className = 'msg ok';
    msg.hidden = false;

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});