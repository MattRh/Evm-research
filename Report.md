# Где разрабатывать

---
Наверное первый вопрос, который может возниктуть в начале изучения Solidity - существующие среды для
разработки и компиляции (с их исполнением все несколько сложнее) смарт-контрактов.
Далее идет список в порядке возрастания веротности использования простым разработчиком.

## Plain text + command line

Контракт на Solidity можно написать в простом блокноте и дать файлу любое расширение,
а потом скомпилировать его используя консольный [solc](https://solidity.readthedocs.io/en/latest/installing-solidity.html), но долго жить так сложно..

## Sublime Text, Atom..
> https://packagecontrol.io/search/Solidity

> https://atom.io/packages/search?q=solidity

Популярные текстовые редакторы не зря являются преемниками Vim и Emacs, благодаря плагинам они могут 
подсвечивать синтаксис Solidity, проводить статический анализ кода, но для этого всего нужно 
разобраться с установкой и, возможно, написанием скриптов для сборки, и тонко все настраивать все под себя, а времени на это жалко.

## Remix Web IDE
> https://remix.ethereum.org

Официальная среда разработки от создателей языка. Может быть запущена локально (оффлайн) при необходимости.
Имеет вроде как все необходимые функции, только дизассемблированный код довольно сложно читать.
При большом желании можно получить относительно читаемый список опкодов, выполнив следующее действие в JS консоли:
```js
var opcodes = "PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE";

console.log(opcodes.replace(/\s([A-Z])/g, '\n$1'));
// PUSH1 0x80
// PUSH1 0x40
// MSTORE
// CALLVALUE
```
Но использовать этот метод систематически довольно затруднительно.

## IntelliJ Idea, VSCode
> https://plugins.jetbrains.com/plugin/9475-intellij-solidity

> https://marketplace.visualstudio.com/search?term=solidity&target=VSCode&category=All%20categories&sortBy=Relevance

Эти две IDE вроде бы единственные, где коммьюнити добавило поддержку Solidity и Ethereum в целом.
По количеству скачиваний плагина решение на платформе Microsoft выглядит более популярным (223K vs 42K),
но я бОльший поклонник платформы IntelliJ, так что я выбрал ее и дальше опишу ее проблемы и достоинства в конкретном случае.

**Плюсы**

// todo

**Минусы**

// todo

# Используемые инструменты

---
Готового для исследований не нашел, так что придется свои писать..
// todo

# Solidity

---
// todo

# Ethereum Virtual Machine

---
// todo

# Security

---
// todo

# Books

---
Found only one book - Building Blockchain Projects: Building decentralized Blockchain applications with Ethereum and Solidity.
_It is worth mention that this book is usefull only in beginning and leaves lots of gaps in meterial_
* English: [Building Blockchain Projects](https://www.amazon.com/Building-Blockchain-Projects-decentralized-applications/dp/178712214X/ref=pd_sbs_14_1?_encoding=UTF8&pd_rd_i=178712214X&pd_rd_r=4YQH2MT0T4WPH9D1EMQZ&pd_rd_w=Gg7O8&pd_rd_wg=r0BeE&psc=1&refRID=4YQH2MT0T4WPH9D1EMQZ)
* Russian: [Блокчейн. Разработка приложений](https://www.ozon.ru/context/detail/id/144895860/)
* Chinese: [Building blockchain projects](https://www.amazon.com/Building-blockchain-projects-Real-time-javascript/dp/B07919XCJ4)

# References

---
It is recommended to follow order of links while reading.
In blogs it is better to start from oldest posts about blockchain/smart-contracts
(thankfully, Ethereum is not so old, so you probably won't gain legacy knowledge)

## Ethereum
* (official wiki) Introduction: https://github.com/ethereum/wiki/wiki/Ethereum-introduction
* (official wiki) Development tutorial: https://github.com/ethereum/wiki/wiki/Ethereum-Development-Tutorial

## Solidity
* (official doc) Partly russian syntax description: [https://github.com/ethereum/wiki/wiki/.....](https://github.com/ethereum/wiki/wiki/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE-%D0%BF%D0%BE-Solidity)
* (official docs) Docs: https://solidity.readthedocs.io/en/latest/
* (3rd party repo) Simple contracts: https://github.com/djrtwo/simple-contracts
* (article) Solidity security best practices: https://consensys.github.io/smart-contract-best-practices/recommendations/

## EVM
### Readings/Videos
* (blog) Diving into EVM: https://medium.com/@hayeah
* (blog) Ethereum founder/EVM developer: https://medium.com/@jeff.ethereum
* (video) EVM, Bytecode & Bugged Smart-Contracts: https://www.youtube.com/watch?v=odOuUhASCII

### Docs/Tools
* (doc) Smart-contracts & EVM analysis: http://www.comae.io/reports/dc25-msuiche-Porosity-Decompiling-Ethereum-Smart-Contracts-wp.pdf
* (official repo) Go Ethereum: https://github.com/ethereum/go-ethereum
* (3rd party repo) Disassembly (unfortunately, seems outdated and written on Python2): https://github.com/tintinweb/ethereum-dasm
* (3rf party soft) Porosity (disassemble, vulnerability analyser): https://github.com/comaeio/porosity

### Opcodes
* (gist) Raw list: https://gist.github.com/hayeah/bd37a123c02fecffbe629bf98a8391df
* (stackoverflow) Separated list: https://ethereum.stackexchange.com/questions/119/what-opcodes-are-available-for-the-ethereum-evm
* (collection) List with costs (compilation of many docs): https://github.com/trailofbits/evm-opcodes

## Need to read, but may be useless
* Implementing the Ethereum Virtual Machine (Part I): https://nervous.io/clojure/crypto/2017/09/12/clojure-evm/
* Под капотом Ethereum Virtual Machine. Часть 1 — Solidity basics: https://habr.com/post/340928/
* (RU) Boring material about EVM, but may be usefull: https://craftappmobile.com/%D0%B2%D0%B8%D1%80%D1%82%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F-%D0%BC%D0%B0%D1%88%D0%B8%D0%BD%D0%B0-ethereum-evm/#EVM

* (official doc) Assembly: https://solidity.readthedocs.io/en/develop/assembly.html
* (blog) Security blog posts: http://swende.se/
