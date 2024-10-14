const express = require('express');
const mysql = require('mysql2/promise'); // 使用 mysql2 的 promise 版
const app = express();

// 创建 MySQL 连接
async function createConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'demo'
  });
  return connection;
}

app.get('/', async (req, res) => {
  try {
    const connection = await createConnection();
    const [results] = await connection.execute('SELECT * FROM demo_data');
    res.json(results);
  } catch (err) {
    res.status(500).send('查询失败');
  }
});

// 启动服务器
app.listen(80, () => {
  console.log(`服务器运行在 http://127.0.0.1`);
});
