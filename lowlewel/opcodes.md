# Ethereum VM (EVM) Opcodes and Instruction Reference

Скрипты для парсинга исходников и сами исходники располагются в папке `.scripts` и используют данные из `.scripts/data`.
Эти скрипты собирают данные в файл `opcodes.json`.
Общий сценарий парсинга:
0. `node clear_opcodes` - удаляет старые данные опкодов (только опкодов, групы и тиеры сохраняются)
0. `node total_parse` - парсит исходники и сохраняет в `opcodes.json`
0. `node table_build` - строит markdown таблицу опкодов и сохраняет в `opcodes.table.md`
0. Скопировать таблицу из `opcodes.table.md` и вставить в этот файл в нужное место

## Sources

Данные об опкодах были взяты из этих файлов:

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
0. Gas costs - получаем `gas_function` - **in progress**
0. Opcodes and Instruction Reference - получаем ссылки на EIP's - **in progress**
0. Assembly list - получаем `assembly` вид - **in progress**

## Notes

The size of a "word" in EVM is 256 bits (32 bytes) and it operates only in "words".

The gas information for Tier::Special tier is only base information, so it can't be lower, but can (and would) be much higher.

Python implementation sets [GAS_LIMIT_MINIMUM = 5000](https://github.com/ethereum/py-evm/blob/master/evm/constants.py#L103) - thus you can't consume less than that

Legend for opcodes table in below the table. It is woth mention that the table is HUGE, so you may have to scroll it horizontally

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

|Mnemonic|Additional_items|Pops|Pushes|Side_effects|Tier|Hex|Description|Gas|
|----|----|----|----|----|----|----|----|----|
|STOP|0|0|0|true|Zero|0x00|Halts execution|0|
|ADD|0|2|1|false|VeryLow|0x01|Addition operation|3|
|MUL|0|2|1|false|Low|0x02|Multiplication operation|5|
|SUB|0|2|1|false|VeryLow|0x03|Subtraction operation|3|
|DIV|0|2|1|false|Low|0x04|Integer division operation|5|
|SDIV|0|2|1|false|Low|0x05|Signed integer division operation|5|
|MOD|0|2|1|false|Low|0x06|Modulo remainder operation|5|
|SMOD|0|2|1|false|Low|0x07|Signed modulo remainder operation|5|
|ADDMOD|0|3|1|false|Mid|0x08|Unsigned modular addition|8|
|MULMOD|0|3|1|false|Mid|0x09|Unsigned modular multiplication|8|
|EXP|0|2|1|false|Special|0x0a|Exponential operation|10|
|SIGNEXTEND|0|2|1|false|Low|0x0b|Extend length of signed integer|5|
|SELFDESTRUCT|0|1|0|true|Special|0xf|Halt execution and register account for later deletion| |
|LT|0|2|1|false|VeryLow|0x10|Less-than comparison|3|
|GT|0|2|1|false|VeryLow|0x11|Greater-than comparison|3|
|SLT|0|2|1|false|VeryLow|0x12|Signed less-than comparison|3|
|SGT|0|2|1|false|VeryLow|0x13|Signed greater-than comparison|3|
|EQ|0|2|1|false|VeryLow|0x14|Equality comparison|3|
|ISZERO|0|1|1|false|VeryLow|0x15|Simple not operator|3|
|AND|0|2|1|false|VeryLow|0x16|Bitwise AND operation|3|
|OR|0|2|1|false|VeryLow|0x17|Bitwise OR operation|3|
|XOR|0|2|1|false|VeryLow|0x18|Bitwise XOR operation|3|
|NOT|0|1|1|false|VeryLow|0x19|Bitwise NOT operation|3|
|BYTE|0|2|1|false|VeryLow|0x1a|Retrieve single byte from word|3|
|SHL|0|2|1|false|VeryLow|0x1b|Bitwise SHL operation| |
|SHR|0|2|1|false|VeryLow|0x1c|Bitwise SHR operation| |
|SAR|0|2|1|false|VeryLow|0x1d|Bitwise SAR operation| |
|KECCAK256|0|2|1|true|Special|0x20|Compute KECCAK-256 hash|30|
|ADDRESS|0|0|1|false|Base|0x30|Get address of currently executing account|2|
|BALANCE|0|1|1|false|Balance|0x31|Get balance of the given account|20|
|ORIGIN|0|0|1|false|Base|0x32|Get execution origination address|2|
|CALLER|0|0|1|false|Base|0x33|Get caller address|2|
|CALLVALUE|0|0|1|false|Base|0x34|Get deposited value by the instruction/transaction responsible for this execution|2|
|CALLDATALOAD|0|1|1|false|VeryLow|0x35|Get input data of current environment|3|
|CALLDATASIZE|0|0|1|false|Base|0x36|Get size of input data in current environment|2|
|CALLDATACOPY|0|3|0|true|VeryLow|0x37|Copy input data in current environment to memory|3|
|CODESIZE|0|0|1|false|Base|0x38|Get size of code running in current environment|2|
|CODECOPY|0|3|0|true|VeryLow|0x39|Copy code running in current environment to memory|3|
|GASPRICE|0|0|1|false|Base|0x3a|Get price of gas in current environment|2|
|EXTCODESIZE|0|1|1|false|ExtCode|0x3b|Get external code size (from another contract)|20|
|EXTCODECOPY|0|4|0|true|ExtCode|0x3c|Copy external code (from another contract)|20|
|RETURNDATASIZE|0|0|1|false|Base|0x3d|Get size of return data buffer|2|
|RETURNDATACOPY|0|3|0|true|VeryLow|0x3e|Copy return data in current environment to memory|3|
|BLOCKHASH|0|1|1|false|Ext|0x40|Get hash of most recent complete block|20|
|COINBASE|0|0|1|false|Base|0x41|Get the block's coinbase address|2|
|TIMESTAMP|0|0|1|false|Base|0x42|Get the block's timestamp|2|
|NUMBER|0|0|1|false|Base|0x43|Get the block's number|2|
|DIFFICULTY|0|0|1|false|Base|0x44|Get the block's difficulty|2|
|GASLIMIT|0|0|1|false|Base|0x45|Get the block's gas limit|2|
|POP|0|1|0|false|Base|0x50|Remove item from stack|2|
|MLOAD|0|1|1|true|VeryLow|0x51|Load word from memory|3|
|MSTORE|0|2|0|true|VeryLow|0x52|Save word to memory|3|
|MSTORE8|0|2|0|true|VeryLow|0x53|Save byte to memory|3|
|SLOAD|0|1|1|false|Special|0x54|Load word from storage|50|
|SSTORE|0|2|0|true|Special|0x55|Save word to storage|0|
|JUMP|0|1|0|true|Mid|0x56|Alter the program counter|8|
|JUMPI|0|2|0|true|High|0x57|Conditionally alter the program counter|10|
|PC|0|0|1|false|Base|0x58|Get the program counter|2|
|MSIZE|0|0|1|false|Base|0x59|Get the size of active memory|2|
|GAS|0|0|1|false|Base|0x5a|Get the amount of available gas|2|
|JUMPDEST|0|0|0|true|Special|0x5b|Set a potential jump destination|1|
|PUSH1|1|0|1|false|VeryLow|0x60|Place 1 byte item on stack|0|
|PUSH2|2|0|1|false|VeryLow|0x61|Place 2 byte item on stack|0|
|PUSH3|3|0|1|false|VeryLow|0x62|Place 3 byte item on stack|0|
|PUSH4|4|0|1|false|VeryLow|0x63|Place 4 byte item on stack|0|
|PUSH5|5|0|1|false|VeryLow|0x64|Place 5 byte item on stack|0|
|PUSH6|6|0|1|false|VeryLow|0x65|Place 6 byte item on stack|0|
|PUSH7|7|0|1|false|VeryLow|0x66|Place 7 byte item on stack|0|
|PUSH8|8|0|1|false|VeryLow|0x67|Place 8 byte item on stack|0|
|PUSH9|9|0|1|false|VeryLow|0x68|Place 9 byte item on stack|0|
|PUSH10|10|0|1|false|VeryLow|0x69|Place 10 byte item on stack|0|
|PUSH11|11|0|1|false|VeryLow|0x6a|Place 11 byte item on stack|0|
|PUSH12|12|0|1|false|VeryLow|0x6b|Place 12 byte item on stack|0|
|PUSH13|13|0|1|false|VeryLow|0x6c|Place 13 byte item on stack|0|
|PUSH14|14|0|1|false|VeryLow|0x6d|Place 14 byte item on stack|0|
|PUSH15|15|0|1|false|VeryLow|0x6e|Place 15 byte item on stack|0|
|PUSH16|16|0|1|false|VeryLow|0x6f|Place 16 byte item on stack|0|
|PUSH17|17|0|1|false|VeryLow|0x70|Place 17 byte item on stack|0|
|PUSH18|18|0|1|false|VeryLow|0x71|Place 18 byte item on stack|0|
|PUSH19|19|0|1|false|VeryLow|0x72|Place 19 byte item on stack|0|
|PUSH20|20|0|1|false|VeryLow|0x73|Place 20 byte item on stack|0|
|PUSH21|21|0|1|false|VeryLow|0x74|Place 21 byte item on stack|0|
|PUSH22|22|0|1|false|VeryLow|0x75|Place 22 byte item on stack|0|
|PUSH23|23|0|1|false|VeryLow|0x76|Place 23 byte item on stack|0|
|PUSH24|24|0|1|false|VeryLow|0x77|Place 24 byte item on stack|0|
|PUSH25|25|0|1|false|VeryLow|0x78|Place 25 byte item on stack|0|
|PUSH26|26|0|1|false|VeryLow|0x79|Place 26 byte item on stack|0|
|PUSH27|27|0|1|false|VeryLow|0x7a|Place 27 byte item on stack|0|
|PUSH28|28|0|1|false|VeryLow|0x7b|Place 28 byte item on stack|0|
|PUSH29|29|0|1|false|VeryLow|0x7c|Place 29 byte item on stack|0|
|PUSH30|30|0|1|false|VeryLow|0x7d|Place 30 byte item on stack|0|
|PUSH31|31|0|1|false|VeryLow|0x7e|Place 31 byte item on stack|0|
|PUSH32|32|0|1|false|VeryLow|0x7f|Place 32 byte item on stack|0|
|DUP1|0|1|2|false|VeryLow|0x80|Copies the highest item in the stack to the top of the stack|3|
|DUP2|0|2|3|false|VeryLow|0x81|Copies the second highest item in the stack to the top of the stack|3|
|DUP3|0|3|4|false|VeryLow|0x82|Copies the third highest item in the stack to the top of the stack|3|
|DUP4|0|4|5|false|VeryLow|0x83|Copies the 4th highest item in the stack to the top of the stack|3|
|DUP5|0|5|6|false|VeryLow|0x84|Copies the 5th highest item in the stack to the top of the stack|3|
|DUP6|0|6|7|false|VeryLow|0x85|Copies the 6th highest item in the stack to the top of the stack|3|
|DUP7|0|7|8|false|VeryLow|0x86|Copies the 7th highest item in the stack to the top of the stack|3|
|DUP8|0|8|9|false|VeryLow|0x87|Copies the 8th highest item in the stack to the top of the stack|3|
|DUP9|0|9|10|false|VeryLow|0x88|Copies the 9th highest item in the stack to the top of the stack|3|
|DUP10|0|10|11|false|VeryLow|0x89|Copies the 10th highest item in the stack to the top of the stack|3|
|DUP11|0|11|12|false|VeryLow|0x8a|Copies the 11th highest item in the stack to the top of the stack|3|
|DUP12|0|12|13|false|VeryLow|0x8b|Copies the 12th highest item in the stack to the top of the stack|3|
|DUP13|0|13|14|false|VeryLow|0x8c|Copies the 13th highest item in the stack to the top of the stack|3|
|DUP14|0|14|15|false|VeryLow|0x8d|Copies the 14th highest item in the stack to the top of the stack|3|
|DUP15|0|15|16|false|VeryLow|0x8e|Copies the 15th highest item in the stack to the top of the stack|3|
|DUP16|0|16|17|false|VeryLow|0x8f|Copies the 16th highest item in the stack to the top of the stack|3|
|SWAP1|0|2|2|false|VeryLow|0x90|Swaps the highest and second highest value on the stack|3|
|SWAP2|0|3|3|false|VeryLow|0x91|Swaps the highest and third highest value on the stack|3|
|SWAP3|0|4|4|false|VeryLow|0x92|Swaps the highest and 4th highest value on the stack|3|
|SWAP4|0|5|5|false|VeryLow|0x93|Swaps the highest and 5th highest value on the stack|3|
|SWAP5|0|6|6|false|VeryLow|0x94|Swaps the highest and 6th highest value on the stack|3|
|SWAP6|0|7|7|false|VeryLow|0x95|Swaps the highest and 7th highest value on the stack|3|
|SWAP7|0|8|8|false|VeryLow|0x96|Swaps the highest and 8th highest value on the stack|3|
|SWAP8|0|9|9|false|VeryLow|0x97|Swaps the highest and 9th highest value on the stack|3|
|SWAP9|0|10|10|false|VeryLow|0x98|Swaps the highest and 10th highest value on the stack|3|
|SWAP10|0|11|11|false|VeryLow|0x99|Swaps the highest and 11th highest value on the stack|3|
|SWAP11|0|12|12|false|VeryLow|0x9a|Swaps the highest and 12th highest value on the stack|3|
|SWAP12|0|13|13|false|VeryLow|0x9b|Swaps the highest and 13th highest value on the stack|3|
|SWAP13|0|14|14|false|VeryLow|0x9c|Swaps the highest and 14th highest value on the stack|3|
|SWAP14|0|15|15|false|VeryLow|0x9d|Swaps the highest and 15th highest value on the stack|3|
|SWAP15|0|16|16|false|VeryLow|0x9e|Swaps the highest and 16th highest value on the stack|3|
|SWAP16|0|17|17|false|VeryLow|0x9f|Swaps the highest and 17th highest value on the stack|3|
|LOG0|0|2|0|true|Special|0xa0|Makes a log entry; no topics.|375|
|LOG1|0|3|0|true|Special|0xa1|Makes a log entry; 1 topic.|750|
|LOG2|0|4|0|true|Special|0xa2|Makes a log entry; 2 topics.|1125|
|LOG3|0|5|0|true|Special|0xa3|Makes a log entry; 3 topics.|1500|
|LOG4|0|6|0|true|Special|0xa4|Makes a log entry; 4 topics.|1875|
|JUMPTO| | | | | |0xb0|Alter the program counter to a jumpdest -- not part of Instructions.cpp| |
|JUMPIF| | | | | |0xb1|Conditionally alter the program counter -- not part of Instructions.cpp| |
|JUMPV| | | | | |0xb2|Alter the program counter to a jumpdest -- not part of Instructions.cpp| |
|JUMPSUB| | | | | |0xb3|Alter the program counter to a beginsub -- not part of Instructions.cpp| |
|JUMPSUBV| | | | | |0xb4|Alter the program counter to a beginsub -- not part of Instructions.cpp| |
|BEGINSUB| | | | | |0xb5|Set a potential jumpsub destination -- not part of Instructions.cpp| |
|BEGINDATA| | | | | |0xb6|Begin the data section -- not part of Instructions.cpp| |
|RETURNSUB| | | | | |0xb7|Return to subroutine jumped from -- not part of Instructions.cpp| |
|PUTLOCAL| | | | | |0xb8|Pop top of stack to local variable -- not part of Instructions.cpp| |
|GETLOCAL| | | | | |0xb9|Push local variable to top of stack -- not part of Instructions.cpp| |
|CREATE|0|3|1|true|Special|0xf0|Create a new account with associated code|32000|
|CALL|0|7|1|true|Special|0xf1|Message-call into an account|40|
|CALLCODE|0|7|1|true|Special|0xf2|Message-call with another account's code only|40|
|RETURN|0|2|0|true|Zero|0xf3|Halt execution returning output data|0|
|DELEGATECALL|0|6|1|true|Special|0xf4|Like CALLCODE but keeps caller's value and sender|40|
|STATICCALL|0|6|1|true|Special|0xfa|Like CALL but disallow state modifications|40|
|CREATE2|0|4|1|true|Special|0xfb|Create new account with associated code at address `sha3(sender + salt + sha3(init code)) % 2**160`| |
|REVERT|0|2|0|true|Zero|0xfd|Halt execution, revert state and return output data|0|
|INVALID|0|0|0|true|Zero|0xfe|Invalid instruction for expressing runtime errors (e.g., division-by-zero)|0|
|SELFDESTRUCT|0|1|0| | |0xff|Halt execution and register account for later deletion.|5000|

## Table Legend

Объяснения некоторых моментов, которые могут быть неочевидны:

* [side_effects](https://github.com/ethereum/solidity/blob/8999a2f375410a29bae46b8e87a70c62036c880d/libevmasm/Instruction.h#L289) - false if the only effect on the execution environment (apart from gas usage) is a change to a topmost segment of the stack
* [additional_items](https://github.com/ethereum/solidity/blob/8999a2f375410a29bae46b8e87a70c62036c880d/libevmasm/Instruction.h#L286) - additional items required in memory for this instructions (only for PUSH)
* [tentative](https://github.com/igarnier/ocaml-geth/blob/cc1601900f11216c48f6b6f47d187d2ca0b855d0/lib/evm.ml#L133) - instructions that EVM can handle (because they are in EIPs) but Solidity don't use them
* [internal](https://github.com/ethereum/cpp-ethereum/blob/70d52b8f384126c75ae1830b6364616fc2eb1da1/libevm/Instruction.cpp#L213) - these are generated by the interpreter - should never be in user code
* assembly_description - sometimes assembly variant has different description from the opcode, then this colun will contain it
* gas_function - формулы для рассчета количества газа у `Tier::Special`
* link - для некоторых опкодов можно найти EIP(Ethereum Internal Proposal) которые немного объясняют стандарт для них

## Conclusion

Промежуточные выводы, которые можно сделать в процессе поиска данных об опкодах и на основе самих данных:
* Solidity использует не все возможности EVM, хотя те, что он НЕ использует являются довольно специфичными.
* EVM может генерировать внутренние опкоды, которые недоступны простым смертным в их контрактах.
* Хоть EVM и заявляется как стэковая машина без регистров, некоторые опкоды все же предполагают, что все же существуют некоторые регистры состояния.
* В EVM есть операция возведения в степень, но нет операции логарифма, лучшие решения вычисления логарифма на stackoverflow потребляют от 700 газа,
 при том, что возведение в степеть требует от 10 газа (является ли это забавным?)
* EVM не знает что такое числа с плащающей запятой, готовьтесь к утекающему сквозь пальцы газу при их использовании
* К счастью, EVM все еще экспериментален и имеет много "свободного места" для новых опкодов, так что можно ожидать решения некоторых проблем в будущем (к счастью ли?) 
* Кто в лес, кто по дрова: есть 3 общепризнанных реализации EVM (помимо еще 2-3 самописных),
каждая реализация на своем языке, это с учетом того, что EVM и Solidity все еще в экспериментальной стадии.
* Обращаться к памяти ОЧЕНЬ дорого
* Можно легко "вылезти" за пределы `GAS_LIMIT` сделав пару обращений к памяти или возведений в степень (хотя об этом больше будет сказано в основном репорте).

## Instruction Details - скорее всего этот блок будет удален в будущем

### ADD

Takes two words from stack, adds them, then pushes the result onto the stack.

Pseudocode: `push(s[0]+s[1])`

### PUSHX

The following X bytes are read from PC, placed into a word, then this word is pushed onto the stack.
