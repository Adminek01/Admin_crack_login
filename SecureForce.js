const crypto = require('crypto');
const readline = require('readline');
const { exec } = require('child_process');

// Utwórz interfejs do odczytu z konsoli
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Funkcja do odczytu danych od użytkownika
function promptUser(question) {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Zdefiniuj funkcję, która tworzy losowy ciąg znaków o danej długości
function randomString(length) {
  // Utwórz bufor o danej długości
  const buffer = crypto.randomBytes(length);
  // Zamień bufor na ciąg znaków w kodowaniu base64
  const string = buffer.toString('base64');
  // Usuń znaki specjalne i zwróć ciąg znaków
  return string.replace(/[^a-zA-Z0-9]/g, '').slice(0, length);
}

// Zdefiniuj funkcję, która tworzy hasło na podstawie danych
function generatePassword(data) {
  // Połącz dane w jeden ciąg znaków
  const input = Object.values(data).join('');
  // Utwórz skrót SHA-256 z ciągu znaków
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  // Zwróć pierwsze 12 znaków skrótu jako hasło
  return hash.slice(0, 12);
}

// Zdefiniuj funkcję, która tworzy login na podstawie danych
function generateLogin(data) {
  // Użyj pierwszej litery imienia i pierwszych 5 liter nazwiska
  const prefix = data.name[0] + data.surname.slice(0, 5);
  // Użyj losowego ciągu znaków o długości 4 jako przyrostek
  const suffix = randomString(4);
  // Zwróć połączenie przedrostka i przyrostka jako login
  return prefix + suffix;
}

// Funkcja do skanowania za pomocą nmap
function scanWithNmap(callback) {
  exec('nmap -sP 192.168.1.0/24', (error, stdout, stderr) => {
    if (error) {
      console.error(`Błąd podczas skanowania: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Błąd podczas skanowania: ${stderr}`);
      return;
    }
    // Przetwórz wynik skanowania
    const hosts = stdout.split('\n').filter(line => line.includes('Nmap scan report'));
    callback(hosts);
  });
}

// Funkcja główna programu
async function configureProgram() {
  // Pobierz dane od użytkownika
  const name = await promptUser('Podaj imię: ');
  const surname = await promptUser('Podaj nazwisko: ');
  const birthdate = await promptUser('Podaj datę urodzenia (DD-MM-YYYY): ');
  const email = await promptUser('Podaj adres email: ');

  // Zaktualizuj dane
  const data = {
    name,
    surname,
    birthdate,
    email
  };

  // Wywołaj funkcję skanowania i generowania danych
  scanWithNmap((hosts) => {
    // Wybierz losowy host
    const randomHost = hosts[Math.floor(Math.random() * hosts.length)];
    // Pobierz ostatni oktet adresu IP
    const lastOctet = randomHost.split('.')[3];
    // Zaktualizuj dane z wykorzystaniem ostatniego oktetu IP
    data.ip = `192.168.1.${lastOctet}`;
    // Wygeneruj login i hasło na podstawie zaktualizowanych danych
    const password = generatePassword(data);
    const login = generateLogin(data);
    // Wyświetl dane
    console.log('Wygenerowane dane:');
    console.log(`Login: ${login}`);
    console.log(`Hasło: ${password}`);
    // Zakończ interfejs do odczytu z konsoli
    rl.close();
  });
}

// Uruchom konfigurację programu
configureProgram();
