# Development

---
Наверное, первый вопрос, который может возниктуть в начале изучения Solidity - существующие среды для
разработки и компиляции (с их исполнением все несколько сложнее) смарт-контрактов.
Далее идет список в порядке возрастания веротности использования простым разработчиком.

## Utilities

Есть два основных инструмента созданных комьюнити для проверки и улучшения смарт-контрактов.
Оба являются линтерами, которые проверяют style guide и ищут проблемы безопасности.
Оба в той или иной степени используются в некоторых плагинах для редакторов, так что о них полездно знать.

* [Solhint](https://github.com/protofire/solhint)
* [Solium](https://github.com/duaraghav8/Solium)

## Editors
### Plain text + command line

Контракт на Solidity можно написать в простом блокноте и дать файлу любое расширение(потому что комьюнити еще не определилось со стандартом),
а потом скомпилировать его используя консольный [solc](https://solidity.readthedocs.io/en/latest/installing-solidity.html), но долго жить с этим довольно сложно..

### Sublime Text, Atom..
> https://packagecontrol.io/search/Solidity

> https://atom.io/packages/search?q=solidity

Популярные текстовые редакторы не зря являются преемниками Vim и Emacs, благодаря плагинам они могут 
подсвечивать синтаксис Solidity, проводить статический анализ кода, но для этого всего нужно 
разобраться с установкой и, возможно, написанием скриптов для сборки, и тонко все настраивать все под себя, а времени на это жалко.

### Remix Web IDE
> https://remix.ethereum.org

Официальная среда разработки от создателей языка. Может быть запущена локально (оффлайн) при необходимости.
Имеет вроде как все необходимые функции, только дизассемблированный код довольно сложно читать (потому что Remix выводит его в одну строку).
При большом желании можно получить относительно читаемый список опкодов, выполнив следующее действие в JS консоли:
```js
let opcodes = "PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE";

console.log(opcodes.replace(/\s([A-Z])/g, '\n$1'));
// PUSH1 0x80
// PUSH1 0x40
// MSTORE
// CALLVALUE
```
Но использовать этот метод систематически довольно затруднительно.

### IntelliJ Idea, VSCode
> https://plugins.jetbrains.com/plugin/9475-intellij-solidity

> https://marketplace.visualstudio.com/search?term=solidity&target=VSCode&category=All%20categories&sortBy=Relevance

Эти две IDE вроде бы единственные, где коммьюнити добавило поддержку Solidity и Ethereum в большей мере.
По количеству скачиваний плагина решение на платформе Microsoft выглядит более популярным (223K vs 42K скачиваний),
и этому даже есть объяснение - VSCode работает на JavaScript и комьюнити создало бесчисленное множество библиотек для Solidity именно на JavaScript.

Но я бОльший поклонник платформы IntelliJ, так что я выбрал ее (а точнее WebStorm - среда разработка для NodeJS)
и дальше опишу опыт ее использования в этом конкретном случае.

**Плюсы:**

// todo: 

**Минусы:**

Плагины для самого Solidity откровенно сырые.
Если подсветка синтаксиса работает еще относительно стабильно 
(хотя при этом не является очень продвинутым, а некоторые продвинутые функции отказываются работаеть), 
Solidity Solhint - порт solhing для IDEA - работает из рук вон плохо.

## More??
Вообще, выше описаны только, на мой взгляд, основные средства для разработки, если хочется больше, то можно посмотреть здесь:
* [Utility](https://github.com/bkrem/awesome-solidity#utility)
* [Editor Plugins](https://github.com/bkrem/awesome-solidity#editor-plugins)

# Tools

---

## Public tools

Здесь те библиотеки или готовые инструменты, которыми можно пользоваться (или нельзя, но они полезны)

### [ethereum-dasm](https://github.com/tintinweb/ethereum-dasm)
Не очень сложный скрипт на питоне, который позволяет дизассемблировать скомпилированный байткод.
К сожалению, написан на Python2 и 2 года не обновлялся(с 2016 года), соответственно поддерживает далеко не все опкоды.

### [manticore](https://github.com/trailofbits/manticore)
Популярный инструмент для посимвольного анализа байткода и поиска инпута, который может уронить контракт.
Автивно поддерживается сообществом и вроде как пользуется популярностью. Написан тоже на Python2 и требует установленного solc/
Являлся одним из источников данных об опкодах, но содержит не полный набор.

### [porosity](https://github.com/comaeio/porosity)
Инструмент для анализа контракта с точки зрения безопасности. Standalone, написан на C++.
Есть документ от его создателей, который может выступать чем-то вроде введения (References -> EVM -> Docs/Tools).

### [solgraph](https://github.com/raineorshine/solgraph)
Визуализатор графа классов(т.е. контрактов) для Solidity.
Генерирует [DOT](https://en.wikipedia.org/wiki/DOT_(graph_description_language)) граф, 
который показывает function control flow. Так же выделяет проблемы безопасности
Написан на JavaScript. Используется в некоторых плагинах для IDE.

## Tools for research
К сожалению продвинутых и удобных (еще и не устаревших) инструментов для анализа и компиляции Solidity
найти не удалось, так что было принято решение написать такой инструмент самому.

### My tool abilities

#### Compile
> `gulp sol_compile`
> `gulp sol_compile_opti`

Компилирует все файлы из папки `src` с расширением `*.sol` в папку `out` с расширением `*.evm` или `*.opti.evm` в зависмости от команды.
Скомплированный файл содержит опкод контракта в текстовом виде, его можно дизассемблировать или скормить EVM.

#### Disassemble
> `gulp disassemble`

Дизассемблирует и сохраняет в виде таблицы, удобной для чтения и анализа человеком
все файлы из папки `out` с расширением `*.evm` в папку `dasm` и расширением `*.dasm`

# Ethereum Virtual Machine

---

## Общее устройство
// todo: как работает, на чем работает, скорость изменения API/Опкодов

### Function hashes
// todo: как генерируются, зачем нужны

### Jumps, branching
// todo: как делаются, какие ограничения

### Function calls
// todo: как вызываются функции

## Память

### Storage
> Обращение через `SLOAD/SSTORE`

// todo

### Memory
> Обращение через `MLOAD/MSTORE/MSTORE8`

// todo

### Stack

// todo

## Opcodes

Всю(на сколько ее найти простому человеку) информацию по опкодам EVM можно увидеть в файле [opcodes.md](https://github.com/MattRh/Evm-research/blob/master/lowlewel/opcodes.md)

# Solidity

---

## Syntax
// todo: описание, что, где, как, пример простого контракта, покрывающего почти все возможности

### Complex structures and arrays
// todo: как они выглядят для разработчика и как для EVM

### Visibility
// todo: уровни видимости переменных и функций

### Modifiers
// todo: интересный механизм, но надо быть аккуратным

### Exceptions
// todo: кидать можно, ловить - нет

## Testing
// todo: рассказать, как все плохо, и есть ли свет в конце туннеля

## Compilation
// todo: какие компялиторы есть и как пользоваться

### ABI
// todo: что это, зачем генерируется и как использовать

### Optimizer
// todo: какие особенности оптимизатора, где он не справляется, где справляется, на что нацелен (на уменьшение потребляемого газа)

## Deployment & Execution
// todo: как добавить контракт в блокчейн, запустить его. Может быть привести интересные контракты уже в блокчеине (например есть один, который собрал уже 1ккк баксов)

### Audit
https://tool.smartdec.net/
https://github.com/ConsenSys/mythril
https://securify.ch/
// todo

## Still have questions?
Если есть какие-то вопросы, которые не были раскрыты в этом документе,
то на них может ответить официальное [FAQ](https://solidity.readthedocs.io/en/latest/frequently-asked-questions.html).

# Solidity --> EVM

---

// todo: основные понятия и данные, и ссылка на док с полным списком ([mappings.md](https://github.com/MattRh/Evm-research/blob/master/lowlewel/mappings.md))

# Security

---

## Problems in Solidity
Многое из описанного ниже можно найти здесь:
* [Solidity -> Security Considerations](https://solidity.readthedocs.io/en/latest/security-considerations.html)
* [Ethereum Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

### By design
// todo

### Compilers
// todo

## Problems in EVM
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
P.S. Links that REALLY worth to visit are marked by **bold text**

## Ethereum
* (official wiki) Introduction: https://github.com/ethereum/wiki/wiki/Ethereum-introduction
* (official wiki) Development tutorial: https://github.com/ethereum/wiki/wiki/Ethereum-Development-Tutorial

## Solidity
* (official doc) Partly russian syntax description: [https://github.com/ethereum/wiki/wiki/.....](https://github.com/ethereum/wiki/wiki/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE-%D0%BF%D0%BE-Solidity)
* (official docs) Docs: https://solidity.readthedocs.io/en/latest/
* (article) **Solidity security best practices**: https://consensys.github.io/smart-contract-best-practices/
* (docs) **Official Solidity FAQ**: https://solidity.readthedocs.io/en/latest/frequently-asked-questions.html
### Code Examples
* https://github.com/djrtwo/simple-contracts
* https://github.com/raineorshine/solidity-by-example
* https://github.com/chriseth/solidity-examples

## EVM
### Readings/Videos
* (blog) **Diving into EVM**: https://medium.com/@hayeah
* (blog) **EVM on GO developer**: https://medium.com/@jeff.ethereum
* (video) **EVM, Bytecode & Bugged Smart-Contracts**: https://www.youtube.com/watch?v=odOuUhASCII
* (RU video) **Rich report on solidity and it's issues**: https://www.youtube.com/watch?v=FbZTJE7b5e8

### Docs/Tools
* (doc) Smart-contracts & EVM analysis: http://www.comae.io/reports/dc25-msuiche-Porosity-Decompiling-Ethereum-Smart-Contracts-wp.pdf
* (official repo) Go Ethereum, contains lots of docs: https://github.com/ethereum/go-ethereum
* (3rd party repo) Disassembly (unfortunately, seems outdated and written on Python2): https://github.com/tintinweb/ethereum-dasm
* (3rf party soft) Porosity (disassemble, vulnerability analyser): https://github.com/comaeio/porosity

### Opcodes
* (gist) Raw list: https://gist.github.com/hayeah/bd37a123c02fecffbe629bf98a8391df
* (stackoverflow) Separated list: https://ethereum.stackexchange.com/questions/119/what-opcodes-are-available-for-the-ethereum-evm
* (collection) List with costs (compilation of many docs): https://github.com/trailofbits/evm-opcodes

---

## Pending list: то, что я еще не прочел, но может оказаться полезным
* Implementing the Ethereum Virtual Machine (Part I): https://nervous.io/clojure/crypto/2017/09/12/clojure-evm/
* Под капотом Ethereum Virtual Machine. Часть 1 — Solidity basics: https://habr.com/post/340928/
* (RU) Boring material about EVM, but may be usefull: https://craftappmobile.com/%D0%B2%D0%B8%D1%80%D1%82%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F-%D0%BC%D0%B0%D1%88%D0%B8%D0%BD%D0%B0-ethereum-evm/#EVM

* (official doc) Assembly: https://solidity.readthedocs.io/en/develop/assembly.html
* (blog) Security blog posts: http://swende.se/


* https://github.com/ethereum/solidity
* https://github.com/ethereum/solidity/blob/develop/docs/bugs.rst
* https://github.com/ethereum/solidity/blob/develop/docs/assembly.rst
* https://github.com/ethereum/solidity/tree/develop/docs

* https://github.com/ethereum/solidity/blob/0edce4b570c157927933697b30f0f94cbdf173b2/libevmasm/SemanticInformation.cpp
* https://github.com/ethereum/solidity/blob/0edce4b570c157927933697b30f0f94cbdf173b2/libevmasm/Instruction.cpp
* https://github.com/ethereum/solidity/blob/0edce4b570c157927933697b30f0f94cbdf173b2/libevmasm/Instruction.h
