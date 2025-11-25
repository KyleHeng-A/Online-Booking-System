const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const TOKEN_FILE = path.join(__dirname, 'data', 'tokens.json');

// 确保 token 文件存在
if (!fs.existsSync(TOKEN_FILE)) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({}));
}

// 模拟一个“用户数据库”
const mockUser = { email: 'test@example.com', password: '12345678' };

// 忘记密码接口
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required.' });
  if (!email.includes('@')) return res.status(400).json({ message: 'Please enter a valid email address.' });

  // 生成随机 token
  const token = crypto.randomBytes(16).toString('hex');
  const expires = Date.now() + 15 * 60 * 1000; // 15分钟有效期

  const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE));
  tokens[token] = { email, expires };
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens));

  // 模拟发送邮件（打印到控制台）
  console.log(`Reset link for ${email}: http://localhost:3000/reset.html?token=${token}`);

  res.json({ message: 'If an account exists for that email, a reset link has been sent.' });
});

// 重置密码接口
app.post('/api/reset-password', (req, res) => {
  const { token, password, confirm } = req.body;
  const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE));
  const record = tokens[token];

  if (!record || Date.now() > record.expires) {
    return res.status(400).json({ message: 'Your reset link is invalid or expired. Please request a new one.' });
  }

  if (!password || !confirm) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  if (password !== confirm) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  if (password.length < 8 || !/[!@#$%^&*]/.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and contain at least one special character.'
    });
  }

  mockUser.password = password;

  delete tokens[token];
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens));

  res.json({ message: 'Your password has been reset successfully.' });
});

app.listen(3000, () => console.log('✅ Server running at http://localhost:3000'));
