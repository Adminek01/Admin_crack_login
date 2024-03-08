// Zaimportuj moduł crypto
const crypto = require('crypto');
const rp = require('request-promise');
const cheerio = require('cheerio');

// Zdefiniuj dane, na podstawie których chcesz generować hasła i loginy
const data = {
  name: 'Jan',
  surname: 'Kowalski',
  birthdate: '01-01-2000',
  email: 'jan.kowalski@example.com'
};

// Zdefiniuj funkcję, która tworzy losowy ciąg znaków o danej długości
function randomString(length) {
  // Utwórz bufor o danej długości
  const buffer = crypto.randomBytes(length);
  // Zamień bufor na ciąg znaków w kodowaniu base64
  const string = buffer.toString('base64');
  // Usuń znaki specjalne i zwróć ciąg znaków
  return string.replace(/[^a-zA-Z0-9]/g, '');
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

// Zdefiniuj stałą
const router_url = 'http://192.168.1.1';

// Zdefiniuj funkcję pomocniczą
function detect_auth_type(router_url) {
  // Utwórz obiekt z opcjami zapytania
  const options = {
    uri: router_url,
    resolveWithFullResponse: true, // zwróć pełną odpowiedź
    simple: false, // nie rzucaj błędu dla kodów 4xx i 5xx
    auth: { // ustaw opcje autoryzacji
      user: 'user', // przykładowa nazwa użytkownika
      pass: 'pass', // przykładowe hasło
      sendImmediately: false // wyślij nagłówek autoryzacji tylko gdy jest wymagany
    }
  };
  // Wyślij zapytanie HTTP z opcjami
  return rp(options)
    .then(response => {
      // Sprawdź kod odpowiedzi i nagłówek WWW-Authenticate
      if (response.statusCode == 401 && response.headers['www-authenticate']) {
        // Zwróć typ autoryzacji z nagłówka
        return response.headers['www-authenticate'].split(' ')[0];
      } else if (response.statusCode == 200) {
        // Załaduj ciało odpowiedzi jako HTML
        const $ = cheerio.load(response.body);
        // Sprawdź, czy istnieje element form
        if ($('form').length > 0) {
          // Zwróć 'HTTP Form'
          return 'HTTP Form';
        } else if (response.headers['server'].startsWith('SSH')) {
          // Zwróć 'SSH'
          return 'SSH';
        } else {
          // Zwróć 'Unknown'
          return 'Unknown';
        }
      } else {
        // Zwróć 'None'
        return 'None';
      }
    })
    .catch(error => {
      // Obsłuż błąd
      console.error(error);
    });
}

// Wygeneruj i wyświetl hasło i login na podstawie danych
const password = generatePassword(data);
const login = generateLogin(data);
console.log(`Hasło: ${password}`);
console.log(`Login: ${login}`);

// Test funkcji detect_auth_type
detect_auth_type(router_url)
  .then(result => {
    // Wyświetl wynik
    console.log(result);
  });
