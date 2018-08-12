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

Эта все та же IDEA, удобная разработки.
Так же комьюнити Ethereum и Solidity очень много пишет именно на JavaScript, 
поэтому довольно удобно использовать WebStorm и написать небольшие обвязки на JS.

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
> **In progress**

#### Compile
> `gulp sol_compile`
> `gulp sol_compile_opti`

Компилирует все файлы из папки `src` с расширением `*.sol` в папку `out` с расширением `*.evm` или `*.opti.evm` в зависмости от команды.
Скомплированный файл содержит опкод контракта в текстовом виде, его можно дизассемблировать или скормить EVM.

#### Disassemble
> `gulp disassemble`

Дизассемблирует и сохраняет в виде таблицы, удобной для чтения и анализа человеком
все файлы из папки `out` с расширением `*.evm` в папку `dasm` и расширением `*.dasm`

# Ethereum
> Disclaimer: описание ethereum ниже не ставит перед собой цель объяснить что такое блокчейн
и не претендует на достоверность и отображает лишь то, как я понял устройство этой технологии

Ethereum - блокчейкн платформа для выполнения смартконтрактов.
Смартконтракты хранятся в самом блокчейне и делят адресное пространство с обычными кошельками.
По сути кошельки и контракты имеют почти одинаковый функционал.

За майнинг блоков майнеры получают эфир(ETH), минимальная платежная единица вэй(Wai) - это 1/10^18 ETH,
для выполнения кода тратится газ(GAS) который является производной валютой от эфира.
(на момент написания статьи 1M газа - это 50 новых записей в storage - стоил $0.8)

Когда контракт надо выполнить он помещается в общий пул задач для выполнения.
Цену на газ устанавливает сам пользователь при вызове контракта, соответственно, чем выше цена,
тем вероятнее контракт будет выполнен в следующем блоке, если гас слишком дешевый, то контракт может бть просто не выполнен.
В отличие от bitcoin, в ethereum блок майнится не монотонным высчитыванием sha функции, а выполнением контрактов из пула.

У контракта есть запас газа для выполнения, который можно пополнять используя эфир.
Так же у одного блока есть лимит потребляемого газа для всех выполняемых контрактов вместе, который нельзя превышать.

EIP (ethereum internal proposal) - местный аналог RFC в мире Ethereum, служит для выдвижения предложений по улучшению платформы.
EIPы находятся [тут](https://github.com/ethereum/EIPs/tree/master/EIPS).

# Ethereum Virtual Machine

---

## Общее устройство
EVM является простой стековой, безрегистровой виртуальной машиной. Имеет основные реализации на Go, C++, Python.

Любая операция в ней стоит газ(GAS), гас имеет динамический курс к ETH,
это позволяет майнерам регилировать сколько будет стоит выполнение контрактов на их машинах без необходимости
каждый раз менять исходный код виртуальной машины.

В итоге становится понятно, что эффективность контракта измеряется не временем выполнения
или объемом потребленной памяти, а лишь объемом потребленного газа
(который, кстати, всегда конечен как для индивидуального контракта, так и для блока).

The machine does not follow the standard von Neumann architecture.
Rather than storing program code in generally-accessible memory or storage, it is stored separately
in a virtual ROM interactable only through a specialised instruction.

Список опкодов меняется только при релизах новых версий Ethereum, что происходит примерно раз в пару лет.
Опкоды при обнлвлении сохраняют обратную совместимость и список просто расширяется (покрайней мере так было на момент написания)

### Jumps, branching
Flow-control(как переход к подпрограммам и возврат, так и прочие ветвления) осуществляется только обычным jump и jumpi(условный прыжок).
прыжок может происходить только на инструкцию 0x5b - JUMPDEST - иначе контракт будет прерван с ошибкой.

Так же есть EIP 615, который пытается расширить функционал flow-control и позволить таким образом статический анализ кода,
но на сколько я понял, он до сих пор так и не принял и ни одной реализации его нет.

### Environment variables
// todo

### Internal states
// todo

## Память
Размер слова - 256 бит (This was chosen to facilitate the Keccak256 hash scheme and elliptic-curve computations).
The memory model is a simple word-addressed byte array.

Ниже представлены базовые структуры памяти в EVM.
Данные частично взяты из [этой статьи](https://habr.com/post/340928/), там же можно найти чуть больше информации.

### Storage
> Обращение через `SLOAD/SSTORE`

Хранит в себе глобальные переменные и является `non-volatile` памятью.
После выполнения контракта все данные будут сохранены в блокчейн и загружены при следующем выполнении.
Из-за того, что эти данные останутся в чейне навсегда является самыс дорогим типом памяти.
Представляет собой хэш-таблицу с 32-байтными ключами и 32-байтными значениями(т.е. теоретически способен хранить в себе 2^261 байт). 
Записать можно в любую ячейку. Проитерироваться по значениям нельзя, можно только перебирать ключи.
Запись ненулевого значения в пустую ячейку стоит 20000GAS, переиспользование занятой ячейки стоит 5000GAS. Стоимость не меняется в зависимости от количества занятых ячеек.
Любая непроинициализированная ячейка памяти хранит в себе нуль.

### Memory
> Обращение через `MLOAD/MSTORE/MSTORE8`, узнать размер `MSIZE`

Чаще всего хранит промежуточные данные - аргументы, передаваемые в функции, локальные перемеменные и значения return.
Является `volatile` памятью, очищается между внешними вызовами функций.
Представляет из себя вектор слов, имеющий стартовую длину 0. Может быть расширена на 1 слово за раз.
Стоимость хранения в memory растет экспоненциально (точнее [квадратично от размера занятой памяти](https://ethereum.stackexchange.com/questions/29896/how-does-the-cost-of-evm-memory-scale)).
В отличие от storage является довольно дешевым хранилищем на начальных этапах, но от 1000 слов в ней начинает обгонять storage по стоимости.
Любая непроинициализированная ячейка памяти хранит в себе нуль.

### Stack
> Обращение через все оставшиеся команды

Точно так же как и memory является `volatile` памятью, используется почти всегда только для арифметических операций.
Имеет довольно ограниченый размер - 1024 слова (32КБ итого),
а при переполнении просто перывает контракт, так что ручные операции с ним довольно опасны.
В основном операции выполняются с 1-3 верхними элементами,
но при этом DUP*, PUSH*, SWAP* могут выполнять оперировать до 16 элементами за раз, в зависимости от конкретной операции.

## Opcodes
Всю(на сколько ее найти простому человеку) информацию по опкодам EVM можно увидеть в файле [lowlevel/opcodes.md](https://github.com/MattRh/Evm-research/blob/master/lowlewel/opcodes.md)
тамже содержится больше комментариев и мыслей о возможностях и состоянии EVM.

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

### Optimizer
// todo: какие особенности оптимизатора, где он не справляется, где справляется, на что нацелен (на уменьшение потребляемого газа)

## Functions

### Function abstraction
EVM не имеет такой абстракции как функции, так что Solidity при вызове контрактр
// todo: как вызываются функции

### Function hashes
Первые 4 байта от sha3 от сигнатуры функции в виде `fnName(paramType1,paramType2,...)`
// todo: как генерируются, зачем нужны

### Function call

### ABI
// todo: что это, зачем генерируется и как использовать

## Deployment & Execution
// todo: как добавить контракт в блокчейн, запустить его. Может быть привести интересные контракты уже в блокчеине (например есть один, который собрал уже 1ккк баксов)

### Audit
Строго рекомендуется проводить аудит контракта (как Solidity кода, так и сгенерированного опкода),
зачем это делать подробнее описано в Security/Flaws. Ниже находится список онлайн-ресурсов для аудита вашего контракта:
* https://tool.smartdec.net/
* https://github.com/ConsenSys/mythril
* https://securify.ch/

## Still have questions?
Если есть какие-то вопросы, которые не были раскрыты в этом документе,
то на них может ответить официальное [FAQ](https://solidity.readthedocs.io/en/latest/frequently-asked-questions.html),
либо можно изучить материалы по ссылкам в секции References.

# Solidity --> EVM translation

---

// todo: основные понятия и данные, и ссылка на док с полным списком ([mappings.md](https://github.com/MattRh/Evm-research/blob/master/lowlewel/mappings.md))

# Security/Flaws

---
Описанное ниже является частью того, что описано в данных документах:
* [Solidity -> Security Considerations](https://solidity.readthedocs.io/en/latest/security-considerations.html)
* [Ethereum Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices)

Список не является полным и создан по большей части, как введение в безопасность в Ethereum и в ЯП Solidity в частности.

## Problems in Solidity

### By design

#### JS like syntax/structure
Solidity реализует стандарт ECMAscript и обладает JavaScript подобным синтаксисом и структурой.
Solidity не привнес чего-то нового, что было бы заточено под решение проблем, которые существуют на платформе Ethereum,
он просто позволяет абстрагироваться от EVM и писать более привычный код.
Скорее всего, было бы не плохо, если бы Solidity не позволял разработчику выстрелить себе в ногу,
либо хотя бы изначально предупреждал, что он намерен это сделать.

#### Immutable contracts
Будучи загруженным в блокчейн, контракт больше не может быть изменен.
Данное ограничение может нести положительный характер, в том ключе, что указав точный адрес контракта вы можете быть уверенным в том,
что он никогда не поменяется, однако, в случае ошибки при разработке и вы не сможете заменить свой контракт. Об этом надо помнить.
P.S. Эта проблема больше относится к Ethereum в целом, но она размещена в блоке Soldity,
потому что [существуют](http://swende.se/blog/EVM-Assembly-trick.html) возможные
[решения](https://www.reddit.com/r/ethereum/comments/4kt1zp/mad_blockchain_science_a_100_upgradeable_contract/) этой проблемы,
и их можно было включить в этот достаточно высокоуровневый ЯП, но увы и ах..

### Carelessness
В данной секции описаны грабли в коде, на которых можно станцевать из-за невнимательности и Solidity вас от этого не защитит

#### Type guessing
В Solidity есть возможность предоставить определение типа переменной компилятору, указав `var` вместо типа переменной. 
К сожалению, какой бы удобной эта функция не казалась, она может создать достаточно неочевидные на первый взгляд проблемы.
Ниже приведен код, который скорее всего содержит баг:
```solidity
for(var i = 0; i < 300; i++) {
    doSomething();
}
```
С точки зрения программиста для обычных - централизованных - систем, здесь нет никакой ошибки. Проблема возникает в том,
что в Solidity ОЧЕНЬ широкий выбор целочисленных типов. Модификатор `var` выбирает минимальный подходящий.
В данном случае `i` будет проинициализирована как `unit8`, чье максимальное значение - 255.
В итоге данный код является бесконечным циклом.

#### Reentrant vulnerability
Нашумевшая уязвимость. Привела к краху The DAO. Ее иллюстрирует данный код:
```solidity
mapping(address => uint) private balance;
function withdraw() {
    uint amount = balance[msg.sender];
    if(!(msg.sender.call.value(amount)())) {
        revert;
    }
    balance[msg.sender] = 0;
}
```
Проблема в том, что `msg.sender.call.value(amount)` вызывает дефолтную функцию у вызывающего и передает в нее нужное количество эфира.
Но если вызывающий является контрактом, то он может модифицировать дефолтную функцию так, чтобы она по кругу вызывала метод `withdraw()`.
Что в итоге приведет к постоянной отправке эфира без его списания.

При этом проблема решается если использовать подход "Checks - effects - interactions".
В таком случае код без ошибки выглядит так:
```solidity
mapping(address => uint) private balance;
function withdraw() {
    uint amount = balance[msg.sender];
    balance[msg.sender] = 0;
    if(!(msg.sender.call.value(amount)())) {
        revert;
    }
}
```
Проблема так же состорит в том, что отправка эфира может быть произведена 3 разными способами начиная от самого небезопасного:
0. `address.call.value(amount)` - отправка эфира и вызов дефолтной функции.
Функция может использовать весь отправленный ей эфир. Уязвима к reentrance vulnerability
0. `address.send(amount)` - отправляет нужное количество эфира и запускает дефолтную функцию,
но ограничивает ее в 2700 газа, этого должно хватить, чтобы записать пару записей в лог об этой операции
0. `address.transfer(amount)` - то же самое, что предыдущий, но при этом сам делает `revert` если операция неудалась.
Самый предпочтительный вариант.

#### Fallback function + text evaluation
В то время, как возможности, описанные в заголовке являются очень мощными и в какой-то момент полезными,
они обе могут оказаться бомбами заложенного действия, накладываясь на другие проблемы платформы (Immutable contracts, Immaturity, Trustless network).

Попытка "заткнуть дыры" языка и платформы, используя эти возможности без должных мер предосторожности может дорого обернуться.
Ошибка, которая стоила Parity (а точнее ее пользователям) $30M возникла именно так.
В данном случае используется принебрежение разработчиками добавления ограничений и то,
что вызов функции по хэшу зависит только от сигнатуры функции и больше ни от чего:
```solidity
contract Wallet {
    address _walletLibrary;
    address owner;
    
    // initWallet() is only invoked by the constructor. WalletLibrary is hardcoded
    function Wallet(address _owner) {
        _walletLibrary = 0xa65......;
        _walletLibrary.delegatecall(bytes4(sha3("initWallet(address)")), _owner);
    }
    
    ....
    
    // fallback function behaves like a "generic forward" (WTF?)
    // Wallet.initWallet(attacker) becomes walletLibrary.initWallet(attacker)
    function () payable {
        _walletLibrary.delegatecall(msg.data);
    }
}
```
Баг был решен(после факапа) добавлением модификатора
```solidity
modifier only_uninitialized {
    if(m_numOwners > 0)
        throw;
    
    _;
}

function initWallet(address[] _owners, uint _required, uint _dayLimit) only_uninitialized { ... }
```

### Immaturity
Платформа Ethereum все еще остается молодой и нестабильной и это тоже несет свои риски и проблемы

#### Compiler
Компилятор Solidity является opensource достоянием, а значит все так же может иметь довольно банальные баги или
неоптимальные участки. Можно уверенно сказать, что он работает приемлимо, но не идеально.
Так что всегда советуется проверять не только сам контракт на баги, но и скомпилисованный опкод,
т.к. именно он будет исполняться на EVM и откатить его уже будет нельзя.

#### Dev tools
Как эксперементальный язык на эксперементальной платформе, без поддержки крупной компании вроде Google/Microsoft/etc.,
EVM и Solidity(хоть вокруг них и крутятся миллионы долларов) не обладает хоть сколько-нибудь продвинутыми средствами разработки.
Да, есть браузерная Remix IDE, но браузерная IDE мало подходит для серьезной разработки. В итоге для поднятия нормального 
окружения для написания контрактов, разработчикам требудется "обмазаться" обвязками на свободные пакеты для solidity (которые, возможно, даже не плохи)
и создать какой-то свой велосипед с крыльями, чтобы автоматизировать разработку. Естественно, такой подход не способствует
бурному росту Ethereum, как децентрализованной виртуальной машины (коей она себя позиционирует),
т.к. написание контрактов превращается в хождение по канату над пропастью без страховки.

## Problems in EVM
Как и любая часть платформы Ethereum, ее виртуальная машина тоже может содержать баги.
Хоть она настолько поста, что это маловероятно. Однако ниже пойдет речь о немного менее очевидных и более фундаментальных проблемах 

### Instructions cost
Сама по себе стоимость инструкций не является проблемой в безопасности.
Однако, простому смертному вполне подсилу написать контракт,
который будет исчерпывать большую часть GAS_LIMIT у всего блока и в итоге просто не будет включаться ни в один блок,
а значит не будет исполнен. По сути разработчик может сам себе подложить DOS бомбу, например, неразумным использованием
сторонних библиотек или частым обращенем к памяти.

### Multiple implementations
Есть офциальные реализации EVM на Go и C++, еще есть активная реализация на Python и горсть сторонних реализаций.
Все ои слабо куррируются и могут содержать абсолютно разный набор багов.

### Call stack attack
Я просто приведу цитату из одного из документов о безопасности в Ethereum.
Довольно подробный анализ данной проблемы дан [тут](http://swende.se/blog/Devcon1-and-contract-security.html).

>Call stack attack, explained by Least Authority takes advantage of the
 fact that a CALL operation will fail if it causes the stack depth to exceed 1024
 frames. Which happens to also be the current limit of the stack as previously
 described earlier. It will ultimately fail and not cause an exception. Unlike
 stack underflow which happens when frames are not present on the stack
 during the invocation of a specific instruction. This is a known problem that
 indicates an error instead of reverting back to the state to the caller. There
 are often a lack of assert checks in Solidity contracts, due to the poor support
 for actual unit testing. Given the special condition requiring to trigger this
 problem, which is an environment specific problem then we cannot easily spot
 it through static analysis. One potential mitigation would be for the EVM
 to implement integrity checks before executing a contract that would ensure
 the state of the stack, and the depth required by the contract (computed
 either dynamically or statically by the compiler) are met.

## Even in Ethereum??
Хоть и нельзя считать сеть Ethereum безопастной, но при этом ее дизайн накладывает определенные ограничения,
о которых не принято задумываться в обычной практике программирования.
В итоге игнорирование этих особенностей может стоить дорого.

### Trustless network
Ethereum - trustless сеть. Это означает, что:
* Вам не стоит полагаться на данные об окружении. Таким образом нельзя полагаться на TIMESTAMP например:
```solidity
function getWinner(address pl1, address pl2) returns(address winner){
    if(block.timestamp % 2 == 0) {
        return pl1;
    } else {
        return pl2;
    }
}
```
Майнер может сообщить такой timestamp, чтобы выиграл нужный игрок.
* Вам не стоит полагаться на порядок транзакций - контракты в пулле могут выполняться в произвольной последовательности,
таким образом если контракт полагается на какую-то определенную цепоку выполнения, то он может быть атакован(называется [frontrunning](http://swende.se/blog/Frontrunning.html))

### Out of control
Вы не контролируете блокчейн. Это подразумевает:
* В нужный момент вы не сможете выдернуть его из розетки, чтобы остановить
* Если кто-то завладел 51% мощностей сети, то вы теряете контроль совсем
* Если сообщество решит внести изменение в какую-то часть логики сети,
и это может нарушить работу вашего контракта, то вы можете заставить их не делать это, вы лишь можете попробовать убедить

### No private data
В Ethereum не может быть данных, которые нельзя узнать. Поля, помеченные private не являются тайной, этот модификатор лишь означает,
что данные в этом поле могут быть изменены лишь внутри контракта. Прочесть их может любой желающий.
Сейчас ведутря работы над тем, чтобы ввести приватные хранилища информации в Ethereum, но гораздо проще хранить
sensitive data на централизованном сервере.

### No true randomness
Из того, что Ethereum - trustless network и out of control можно сделать вывод, что это очень сложно получить 
истинный источник случайных чисел. Можно лишь максимально усложнить угадывание числа.

### Your balance is not constant
Нельзя считать, что вы контроллируете баланс вашего контракта. 
Да, никто не может свободно забрать с него баланс. Но это не означает, что никто не может свободно поолнить его баланс. 
В сети Ethereum можно насильно пополнить чужой счет. Например при коплении какого-то банка для розыгрыша нельзя делать так?
```solidity
if(this.balance == expectedNumber) {
    doSomething();
}
```
правильнее делать проверку "больше либо равно"
```solidity
if(this.balance >= expectedNumber) {
    doSomething();
}
```

## We gona ~~die~~loose all our money?
Даже с таким списком потенциальных проблем на платформе Ethereum запускаются сотни ICO и они все еще работают
(хотя [периодически](https://xakep.ru/2016/06/17/splitdao-attack) и случаются [факапы](https://tproger.ru/news/ethereum-bug-in-parity-wallet/)).
Чтобы обезопасить себя и своих пользователей надо выполнять как минимум самые простые операции.
Ничего из этого списка не выполнится само за вас:
* Используйте линтеры. Это просто и эффективно
* Используйте программы по аудиту кода. Это тоже просто
* Есть открытый фрэймворк - [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity) - им пользоваться хорошо, он нацелен на безопасность
* Пишите тесты и очень тщательно проверяйте код на уязвимости(не просто на баги, а именно уязвимости) перед выкладкой. Вы не сможете перезаписать контракт позже
* Баги в любом случае неизбежны, так что обдумайте заранее как вы будете делать rollback

# Result
Если вы дочитали досюда, то у вас могло сложиться об Ethereum + EVM + Solidity,
как об ужасной платформе от которой стоит держаться подальше. Я рад, если так произошло, а вы считали раньше эту платформу Святым Граалем.
Мое мнение, что о ней стоит думать скорее как о Ящике Пандоры - может сотворить зло, но если повзет, то можно хорошо преуспеть.

В то же время хочу напомнить, что ЯП COBOL тоже не был идеален, однако на нем написано большинство банковского ПО,
которое до сих пор используется, и мир до сих пор не сколлапсировал :)

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
* (blog) Security blog posts: http://swende.se/

## Solidity
* (RU video) **Introduction to Solidity**: https://www.youtube.com/watch?v=mtvkFzW3o3Y
* (official doc) Partly russian syntax description: [https://github.com/ethereum/wiki/wiki/.....](https://github.com/ethereum/wiki/wiki/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE-%D0%BF%D0%BE-Solidity)
* (official docs) Docs: https://solidity.readthedocs.io/en/latest/
* (article) **Solidity security best practices**: https://consensys.github.io/smart-contract-best-practices/
* (docs) **Official Solidity FAQ**: https://solidity.readthedocs.io/en/latest/frequently-asked-questions.html
### Code Examples
* https://github.com/djrtwo/simple-contracts
* https://github.com/raineorshine/solidity-by-example
* https://github.com/chriseth/solidity-examples
* https://learnxinyminutes.com/docs/solidity/

## EVM
### Readings/Videos
* (blog) **Diving into EVM**: https://medium.com/@hayeah
* (blog) **EVM on GO developer**: https://medium.com/@jeff.ethereum
* (video) **EVM, Bytecode & Bugged Smart-Contracts**: https://www.youtube.com/watch?v=odOuUhASCII
* (RU video) **Rich report on solidity and it's issues**: https://www.youtube.com/watch?v=FbZTJE7b5e8
* (RU doc) Под капотом Ethereum Virtual Machine: https://habr.com/post/340928/
* (official doc) EVM yellowpaper: http://yellowpaper.io/

### Docs/Tools
* (doc) Smart-contracts & EVM analysis: http://www.comae.io/reports/dc25-msuiche-Porosity-Decompiling-Ethereum-Smart-Contracts-wp.pdf
* (research) A Complete Semantics of the Ethereum Virtual Machine: https://www.ideals.illinois.edu/bitstream/handle/2142/97207/hildenbrandt-saxena-zhu-rodrigues-guth-daian-rosu-2017-tr.pdf
* (official repo) Go Ethereum, contains lots of docs: https://github.com/ethereum/go-ethereum
* (3rd party repo) Disassembly (unfortunately, seems outdated and written on Python2): https://github.com/tintinweb/ethereum-dasm
* (3rf party soft) Porosity (disassemble, vulnerability analyser): https://github.com/comaeio/porosity

### Opcodes
* (gist) Raw list: https://gist.github.com/hayeah/bd37a123c02fecffbe629bf98a8391df
* (stackoverflow) Separated list: https://ethereum.stackexchange.com/questions/119/what-opcodes-are-available-for-the-ethereum-evm
* (collection) List with costs (compilation of many docs): https://github.com/trailofbits/evm-opcodes
* (doc) Api reference: https://hexdocs.pm/evm/api-reference.html

---

## Pending list: то, что я еще не прочел, но может оказаться полезным
* Implementing the Ethereum Virtual Machine (Part I): https://nervous.io/clojure/crypto/2017/09/12/clojure-evm/
* (RU doc) Обовсем и одновременно ниочем казательно Ethereum и EVM: https://craftappmobile.com/%D0%B2%D0%B8%D1%80%D1%82%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F-%D0%BC%D0%B0%D1%88%D0%B8%D0%BD%D0%B0-ethereum-evm/#EVM
* (official doc) Assembly: https://solidity.readthedocs.io/en/develop/assembly.html

* https://github.com/ethereum/solidity
* https://github.com/ethereum/solidity/blob/develop/docs/bugs.rst
* https://github.com/ethereum/solidity/blob/develop/docs/assembly.rst
* https://github.com/ethereum/solidity/tree/develop/docs

* https://github.com/ethereum/solidity/blob/0edce4b570c157927933697b30f0f94cbdf173b2/libevmasm/SemanticInformation.cpp
* https://github.com/ethereum/solidity/blob/0edce4b570c157927933697b30f0f94cbdf173b2/libevmasm/Instruction.cpp
* https://github.com/ethereum/solidity/blob/0edce4b570c157927933697b30f0f94cbdf173b2/libevmasm/Instruction.h
