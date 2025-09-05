const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://orangegram.dpdns.org",
        methods: ["GET", "POST"]
    }
});

// Хранилище сообщений
const messages = [];

io.on('connection', (socket) => {
    console.log('User connected');

    // Отправить историю сообщений новому пользователю
    socket.emit('message-history', messages);

    // Обработка новых сообщений
    socket.on('send-message', (data) => {
        const message = {
            id: Date.now(),
            text: data.text,
            user: data.user,
            time: new Date().toLocaleTimeString()
        };

        messages.push(message);
        io.emit('new-message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Chat server running on port ${PORT}`);
});