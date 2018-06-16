# Ethereum VM (EVM) Opcodes and Instruction Reference

Скрипты для парсинга исходников и сами исходники располагются в папке `.scripts`.
Эти скрипты собирают данные в файл `opcodes.json`,
который потом можно скомпилировать в полноценную markdown таблицу и вставить ниже в соответствующую сецию

## Sources

Из этих файлов были взяты данные об опкодах:

* Manticore: [trailofbits/manticore](https://github.com/trailofbits/manticore/blob/cf6cd0eaf2bd4f38b16c6ee2027e1c219e5eafe8/manticore/platforms/evm.py#L412)
* Gas costs: [evm-opcode-gas-costs](https://github.com/djrtwo/evm-opcode-gas-costs/blob/d76683b33b6fffb7bf7af8706d9f6f63db3af182/opcode-gas-costs_EIP-150_revision-1e18248_2017-04-12.csv)
* Opcodes and Instruction Reference: [Ethereum VM (EVM) Opcodes and Instruction Reference](https://github.com/trailofbits/evm-opcodes/blob/8d467f1a319f20737991f43aff9e0b1489a09899/README.md)

* Solidity comments: [solidity/libevmasm/Instruction.h](https://github.com/ethereum/solidity/blob/8999a2f375410a29bae46b8e87a70c62036c880d/libevmasm/Instruction.h#L38)
* Solidity: [solidity/libevmasm/Instruction.cpp](https://github.com/ethereum/solidity/blob/0edce4b570c157927933697b30f0f94cbdf173b2/libevmasm/Instruction.cpp)
* [solidity/libevmasm/AssemblyItem.cpp](https://github.com/ethereum/solidity/blob/8999a2f375410a29bae46b8e87a70c62036c880d/libevmasm/AssemblyItem.cpp#L60)
* [solidity/libevmasm/SemanticInformation.cpp](https://github.com/ethereum/solidity/blob/8999a2f375410a29bae46b8e87a70c62036c880d/libevmasm/SemanticInformation.cpp#L31)
* Assembly: [solidity/docs/assembly.rst](https://github.com/ethereum/solidity/blob/develop/docs/assembly.rst)

* Ethereum comments: [cpp-ethereum/libevm/Instruction.h](https://github.com/ethereum/cpp-ethereum/blob/70d52b8f384126c75ae1830b6364616fc2eb1da1/libevm/Instruction.h)
* Ethereum: [cpp-ethereum/libevm/Instruction.cpp](https://github.com/ethereum/cpp-ethereum/blob/70d52b8f384126c75ae1830b6364616fc2eb1da1/libevm/Instruction.cpp)

## Parse sequence

Здесь описана последовательность, в которой происходит парсинг исходников и описывается, почему он именно такой

0. Solidity comments - получаем текущий список используемых опкодов и их `description`
0. Solidity - получаем количество `pops` и `pushes` для предыдущего шага
0. Ethereum comments - все опкоды которые добавляться здесь являются `tentative`
0. Ethereum - получаем количество `pops` и `pushes` для предыдущего шага
0. Manticore - получаем `additional_items`, `gas` и `description` для тех опкодов, у которых их еще нет
0. Gas costs - получаем `gas_function` - формулы для рассчета количества газа у `Tier::Special`
0. Opcodes and Instruction Reference - получаем ссылки на EIP's - **in progress**
0. Assembly list - получаем `assembly` вид - **in progress**

## Notes

The size of a "word" in EVM is 256 bits (32 bytes) and it operates only in "words".

The gas information for Tier::Special tier is only base information, so it can't be lower, but can (and would) be much higher.

Python implementation sets [GAS_LIMIT_MINIMUM = 5000](https://github.com/ethereum/py-evm/blob/master/evm/constants.py#L103) - thus you can't consume less than that

## Tables

### Groups

|Prefix|Description|
|----|----|
|0x00|Stop and Arithmetic Operations|
|0x10|Comparison & Bitwise Logic Operations|
|0x20|SHA3|
|0x30|Environmental Information|
|0x40|Block Information|
|0x50|Stack, Memory, Storage and Flow Operations|
|0x60|Push Operations|
|0x70|Push Operations|
|0x80|Duplication Operations|
|0x90|Exchange Operations|
|0xa0|Logging Operations|
|0xf0|System operations|

### Tiers

|Tier|Cost|Comment|
|----|----|----|
|Zero|0|Zero|
|Base|2|Quick|
|VeryLow|3|Fastest|
|Low|5|Fast|
|Mid|8|Mid|
|High|10|Slow|
|Ext|20|Ext|
|ExtCode|700|Extcode|
|Balance|400|Balance|
|Special| |multiparam or otherwise special|
|Invalid|0|Invalid|

### Opcodes

|Mnemonic|Additional_items|Pops|Pushes|Side_effects|Tier|Hex|Gas|Description|
|----|----|----|----|----|----|----|----|----|
|STOP|0|0|0|true|Zero|0x00|0|Halts execution|
|ADD|0|2|1|false|VeryLow|0x01|3|Addition operation.|
|ADD| | | | | |0x1| |Addition operation|
|MUL|0|2|1|false|Low|0x02|5|Multiplication operation.|
|MUL| | | | | |0x2| |Multiplication operation|
|SUB| | | | | |0x3| |Subtraction operation|
|SUB|0|2|1|false|VeryLow|0x03|3|Subtraction operation.|
|DIV|0|2|1|false|Low|0x04|5|Integer division operation.|

## Table Notes

Объяснения некоторых моментов, которые могут быть неочевидны:

* [side_effects](https://github.com/ethereum/solidity/blob/8999a2f375410a29bae46b8e87a70c62036c880d/libevmasm/Instruction.h#L289) - false if the only effect on the execution environment (apart from gas usage) is a change to a topmost segment of the stack
* [additional_items](https://github.com/ethereum/solidity/blob/8999a2f375410a29bae46b8e87a70c62036c880d/libevmasm/Instruction.h#L286) - additional items required in memory for this instructions (only for PUSH)
* [tentative](https://github.com/igarnier/ocaml-geth/blob/cc1601900f11216c48f6b6f47d187d2ca0b855d0/lib/evm.ml#L133) - instructions that EVM can handle (because they are in EIPs) but Solidity don't use them
* [internal](https://github.com/ethereum/cpp-ethereum/blob/70d52b8f384126c75ae1830b6364616fc2eb1da1/libevm/Instruction.cpp#L213) - these are generated by the interpreter - should never be in user code

## Conclusion

Промежуточные выводы, которые можно сделать в процессе поиска данных об опкодах и на основе самих данных:
* Solidity использует не все возможности EVM, хотя те, что он не использует являются довольно специфичными.
* EVM может генерировать внутренние опкоды, которые недоступны простым смертным в их контрактах.
* Хоть EVM и заявляется как стэковая машина без регистров, некоторые опкоды все же предполагают, что некоторые регистры состояния все же существуют.
* В EVM есть операция возведения в степень, но нет операции логарифма (является ли это забавным?)
* EVM не знает что такое числа с плащающей запятой, готовьтесь к утекающему сквозь пальцы газу при их использовании
* 
* Кто в лес, кто по дрова: есть 3 общепризнанных реализации EVM (помимо еще 2-3 самописных),
каждая реализация на своем языке, это с учетом того, что EVM и Solidity все еще в экспериментальной стадии.
* Обращаться к памяти ОЧЕНЬ дорого
* Можно легко "вылезти" за пределы `GAS_LIMIT` сделав пару обращений к памяти или возведений в степень (хотя об этом больше будет сказано в основном репорте).

## Instruction Details

### ADD

Takes two words from stack, adds them, then pushes the result onto the stack.

Pseudocode: `push(s[0]+s[1])`

### PUSHX

The following X bytes are read from PC, placed into a word, then this word is pushed onto the stack.
