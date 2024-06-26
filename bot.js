const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '7031904200:AAGkpHUVBmP_qgp6dNifzlD-sgGOAl4RzO8';
const apiKey = 'DDB9PFHRN8XHCCCDNNAXCP8K7N6MFZZCHJ';

const contractAddress = '0xF9e631014Ce1759d9B76Ce074D496c3da633BA12';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the Zo World Bot! Send /help to get list of commands');
});


bot.onText(/\/txn/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const events = await getContractEvents();
        events.forEach((event, index) => {
            const formattedEvent = formatEvent(index + 1, event);
            bot.sendMessage(chatId, formattedEvent, { parse_mode: 'Markdown' });
        });
    } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, 'Error fetching contract events. Please try again later.');
    }
});

function formatEvent(eventNumber, event) {
    let formattedEvent = `*Event ${eventNumber}*\n`;
    formattedEvent += `- Address: ${hexToDecimal(event.address)}\n`;
    formattedEvent += `- Topics: ${event.topics.join(', ')}\n`;
    formattedEvent += `- Data: ${hexToDecimal(event.data)}\n`;
    formattedEvent += `- Block Number: ${hexToDecimal(event.blockNumber)}\n`;
    formattedEvent += `- Block Hash: ${hexToDecimal(event.blockHash)}\n`;
    formattedEvent += `- Timestamp: ${hexToDecimal(event.timeStamp)}\n`;
    formattedEvent += `- Gas Price: ${hexToDecimal(event.gasPrice)}\n`;
    formattedEvent += `- Gas Used: ${hexToDecimal(event.gasUsed)}\n`;
    formattedEvent += `- Log Index: ${hexToDecimal(event.logIndex)}\n`;
    formattedEvent += `- Transaction Hash: ${hexToDecimal(event.transactionHash)}\n`;
    formattedEvent += `- Transaction Index: ${hexToDecimal(event.transactionIndex)}\n\n`;
    return formattedEvent;
}

async function getContractEvents() {
    try {
        const url = `https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${contractAddress}&apikey=${apiKey}`;
        const response = await axios.get(url);
        const events = response.data.result.slice(0, 10);
        return events;
    } catch (error) {
        console.error('Error fetching contract events:', error);
        throw error;
    }
}

function hexToDecimal(hex) {
    return parseInt(hex, 16);
}
