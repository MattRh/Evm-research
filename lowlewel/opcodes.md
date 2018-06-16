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
|ADD|0|2|1|false|VeryLow|0x1| |Addition operation|
|MUL|0|2|1|false|Low|0x02|5|Multiplication operation.|
|MUL| | | | | |0x2| |Multiplication operation|
|SUB|0|2|1|false|VeryLow|0x3| |Subtraction operation|
|SUB|0|2|1|false|VeryLow|0x03|3|Subtraction operation.|
|DIV|0|2|1|false|Low|0x04|5|Integer division operation.|
|DIV| | | | | |0x4| |Integer division operation|
|SDIV|0|2|1| | |0x05|5|Signed integer division operation (truncated).|
|SDIV| | | | | |0x5| |Signed integer division operation|
|MOD| | | | | |0x6| |Modulo remainder operation|
|MOD|0|2|1| | |0x06|5|Modulo remainder operation.|
|SMOD| | | | | |0x7| |Signed modulo remainder operation|
|SMOD|0|2|1| | |0x07|5|Signed modulo remainder operation.|
|ADDMOD| | | | | |0x8| |Unsigned modular addition|
|ADDMOD|0|3|1| | |0x08|8|Modulo addition operation.|
|EQ|0|2|1|false|VeryLow| | | |
|ISZERO|0|1|1|false|VeryLow| | | |
|AND|0|2|1|false|VeryLow| | | |
|OR|0|2|1|false|VeryLow| | | |
|XOR|0|2|1|false|VeryLow| | | |
|BYTE|0|2|1|false|VeryLow| | | |
|SHL|0|2|1|false|VeryLow| | | |
|SHR|0|2|1|false|VeryLow| | | |
|SAR|0|2|1|false|VeryLow| | | |
|ADDMOD|0|3|1|false|Mid| | | |
|MULMOD|0|3|1|false|Mid| | | |
|SIGNEXTEND|0|2|1|false|Low| | | |
|KECCAK256|0|2|1|true|Special| | | |
|ADDRESS|0|0|1|false|Base| | | |
|BALANCE|0|1|1|false|Balance| | | |
|ORIGIN|0|0|1|false|Base| | | |
|CALLER|0|0|1|false|Base| | | |
|CALLVALUE|0|0|1|false|Base| | | |
|CALLDATALOAD|0|1|1|false|VeryLow| | | |
|CALLDATASIZE|0|0|1|false|Base| | | |
|CALLDATACOPY|0|3|0|true|VeryLow| | | |
|CODESIZE|0|0|1|false|Base| | | |
|CODECOPY|0|3|0|true|VeryLow| | | |
|GASPRICE|0|0|1|false|Base| | | |
|EXTCODESIZE|0|1|1|false|ExtCode| | | |
|EXTCODECOPY|0|4|0|true|ExtCode| | | |
|RETURNDATASIZE|0|0|1|false|Base| | | |
|RETURNDATACOPY|0|3|0|true|VeryLow| | | |
|BLOCKHASH|0|1|1|false|Ext| | | |
|COINBASE|0|0|1|false|Base| | | |
|TIMESTAMP|0|0|1|false|Base| | | |
|NUMBER|0|0|1|false|Base| | | |
|DIFFICULTY|0|0|1|false|Base| | | |
|GASLIMIT|0|0|1|false|Base| | | |
|POP|0|1|0|false|Base| | | |
|MLOAD|0|1|1|true|VeryLow| | | |
|MSTORE|0|2|0|true|VeryLow| | | |
|MSTORE8|0|2|0|true|VeryLow| | | |
|SLOAD|0|1|1|false|Special| | | |
|SSTORE|0|2|0|true|Special| | | |
|JUMP|0|1|0|true|Mid| | | |
|JUMPI|0|2|0|true|High| | | |
|PC|0|0|1|false|Base| | | |
|MSIZE|0|0|1|false|Base| | | |
|GAS|0|0|1|false|Base| | | |
|JUMPDEST|0|0|0|true|Special| | | |
|PUSH1|1|0|1|false|VeryLow| | | |
|PUSH2|2|0|1|false|VeryLow| | | |
|PUSH3|3|0|1|false|VeryLow| | | |
|PUSH4|4|0|1|false|VeryLow| | | |
|PUSH5|5|0|1|false|VeryLow| | | |
|PUSH6|6|0|1|false|VeryLow| | | |
|PUSH7|7|0|1|false|VeryLow| | | |
|PUSH8|8|0|1|false|VeryLow| | | |
|MULMOD| | | | | |0x9| |Unsigned modular multiplication|
|PUSH10|10|0|1|false|VeryLow| | | |
|PUSH11|11|0|1|false|VeryLow| | | |
|PUSH12|12|0|1|false|VeryLow| | | |
|PUSH13|13|0|1|false|VeryLow| | | |
|PUSH14|14|0|1|false|VeryLow| | | |
|PUSH15|15|0|1|false|VeryLow| | | |
|PUSH16|16|0|1|false|VeryLow| | | |
|PUSH17|17|0|1|false|VeryLow| | | |
|PUSH18|18|0|1|false|VeryLow| | | |
|PUSH19|19|0|1|false|VeryLow| | | |
|PUSH20|20|0|1|false|VeryLow| | | |
|PUSH21|21|0|1|false|VeryLow| | | |
|PUSH22|22|0|1|false|VeryLow| | | |
|PUSH23|23|0|1|false|VeryLow| | | |
|PUSH24|24|0|1|false|VeryLow| | | |
|PUSH25|25|0|1|false|VeryLow| | | |
|PUSH26|26|0|1|false|VeryLow| | | |
|PUSH27|27|0|1|false|VeryLow| | | |
|PUSH28|28|0|1|false|VeryLow| | | |
|PUSH29|29|0|1|false|VeryLow| | | |
|PUSH30|30|0|1|false|VeryLow| | | |
|PUSH31|31|0|1|false|VeryLow| | | |
|PUSH32|32|0|1|false|VeryLow| | | |
|DUP1|0|1|2|false|VeryLow| | | |
|DUP2|0|2|3|false|VeryLow| | | |
|DUP3|0|3|4|false|VeryLow| | | |
|DUP4|0|4|5|false|VeryLow| | | |
|DUP5|0|5|6|false|VeryLow| | | |
|DUP6|0|6|7|false|VeryLow| | | |
|DUP7|0|7|8|false|VeryLow| | | |
|DUP8|0|8|9|false|VeryLow| | | |
|DUP9|0|9|10|false|VeryLow| | | |
|DUP10|0|10|11|false|VeryLow| | | |
|DUP11|0|11|12|false|VeryLow| | | |
|DUP12|0|12|13|false|VeryLow| | | |
|DUP13|0|13|14|false|VeryLow| | | |
|DUP14|0|14|15|false|VeryLow| | | |
|DUP15|0|15|16|false|VeryLow| | | |
|DUP16|0|16|17|false|VeryLow| | | |
|SWAP1|0|2|2|false|VeryLow| | | |
|SWAP2|0|3|3|false|VeryLow| | | |
|SWAP3|0|4|4|false|VeryLow| | | |
|SWAP4|0|5|5|false|VeryLow| | | |
|SWAP5|0|6|6|false|VeryLow| | | |
|SWAP6|0|7|7|false|VeryLow| | | |
|SWAP7|0|8|8|false|VeryLow| | | |
|SWAP8|0|9|9|false|VeryLow| | | |
|SWAP9|0|10|10|false|VeryLow| | | |
|SWAP10|0|11|11|false|VeryLow| | | |
|SWAP11|0|12|12|false|VeryLow| | | |
|SWAP12|0|13|13|false|VeryLow| | | |
|SWAP13|0|14|14|false|VeryLow| | | |
|SWAP14|0|15|15|false|VeryLow| | | |
|SWAP15|0|16|16|false|VeryLow| | | |
|SWAP16|0|17|17|false|VeryLow| | | |
|LOG0|0|2|0|true|Special| | | |
|LOG1|0|3|0|true|Special| | | |
|LOG2|0|4|0|true|Special| | | |
|LOG3|0|5|0|true|Special| | | |
|LOG4|0|6|0|true|Special| | | |
|CREATE|0|3|1|true|Special| | | |
|CALL|0|7|1|true|Special| | | |
|CALLCODE|0|7|1|true|Special| | | |
|RETURN|0|2|0|true|Zero| | | |
|DELEGATECALL|0|6|1|true|Special| | | |
|STATICCALL|0|6|1|true|Special| | | |
|CREATE2|0|4|1|true|Special| | | |
|REVERT|0|2|0|true|Zero| | | |
|INVALID|0|0|0|true|Zero| | | |
|PUSH9|9|0|1|false|VeryLow| | | |
|SDIV|0|2|1|false|Low| | | |
|SELFDESTRUCT|0|1|0|true|Special| | | |
|MOD|0|2|1|false|Low| | | |
|SMOD|0|2|1|false|Low| | | |
|EXP|0|2|1|false|Special| | | |
|NOT|0|1|1|false|VeryLow| | | |
|MULMOD|0|3|1| | |0x09|8|Modulo multiplication operation.|
|LT|0|2|1|false|VeryLow| | | |
|GT|0|2|1|false|VeryLow| | | |
|SLT|0|2|1|false|VeryLow| | | |
|SGT|0|2|1|false|VeryLow| | | |
|EXP| | | | | |0xa| |Exponential operation|
|EXP|0|2|1| | |0x0a|10|Exponential operation.|
|SIGNEXTEND| | | | | |0xb| |Extend length of signed integer|
|SIGNEXTEND|0|2|1| | |0x0b|5|Extend length of twos complement signed integer.|
|SELFDESTRUCT| | | | | |0xf| |Halt execution and register account for later deletion|
|LT|0|2|1| | |0x10|3|Less-than comparison|
|GT|0|2|1| | |0x11|3|Greater-than comparison|
|SLT|0|2|1| | |0x12|3|Signed less-than comparison|
|SGT|0|2|1| | |0x13|3|Signed greater-than comparison|
|EQ|0|2|1| | |0x14|3|Equality comparison|
|ISZERO|0|1|1| | |0x15|3|Simple not operator|
|AND|0|2|1| | |0x16|3|Bitwise AND operation|
|OR|0|2|1| | |0x17|3|Bitwise OR operation|
|XOR|0|2|1| | |0x18|3|Bitwise XOR operation|
|NOT|0|1|1| | |0x19|3|Bitwise NOT operation|
|BYTE|0|2|1| | |0x1a|3|Retrieve single byte from word|
|SHL| | | | | |0x1b| |Bitwise SHL operation|
|SHR| | | | | |0x1c| |Bitwise SHR operation|
|SAR| | | | | |0x1d| |Bitwise SAR operation|
|SHA3|0|2|1| | |0x20|30|Compute KECCAK-256 hash|
|ADDRESS|0|0|1| | |0x30|2|Get address of currently executing account|
|BALANCE|0|1|1| | |0x31|20|Get balance of the given account|
|ORIGIN|0|0|1| | |0x32|2|Get execution origination address|
|CALLER|0|0|1| | |0x33|2|Get caller address|
|CALLVALUE|0|0|1| | |0x34|2|Get deposited value by the instruction/transaction responsible for this execution|
|CALLDATALOAD|0|1|1| | |0x35|3|Get input data of current environment|
|CALLDATASIZE|0|0|1| | |0x36|2|Get size of input data in current environment|
|CALLDATACOPY|0|3|0| | |0x37|3|Copy input data in current environment to memory|
|CODESIZE|0|0|1| | |0x38|2|Get size of code running in current environment|
|CODECOPY|0|3|0| | |0x39|3|Copy code running in current environment to memory|
|GASPRICE|0|0|1| | |0x3a|2|Get price of gas in current environment|
|EXTCODESIZE|0|1|1| | |0x3b|20|Get external code size (from another contract)|
|EXTCODECOPY|0|4|0| | |0x3c|20|Copy external code (from another contract)|
|RETURNDATASIZE|0|0|1| | |0x3d|2|Get size of return data buffer|
|RETURNDATACOPY|0|3|0| | |0x3e|3|Copy return data in current environment to memory|
|BLOCKHASH|0|1|1| | |0x40|20|Get hash of most recent complete block|
|COINBASE|0|0|1| | |0x41|2|Get the block's coinbase address|
|TIMESTAMP|0|0|1| | |0x42|2|Get the block's timestamp|
|NUMBER|0|0|1| | |0x43|2|Get the block's number|
|DIFFICULTY|0|0|1| | |0x44|2|Get the block's difficulty|
|GASLIMIT|0|0|1| | |0x45|2|Get the block's gas limit|
|POP|0|1|0| | |0x50|2|Remove item from stack|
|MLOAD|0|1|1| | |0x51|3|Load word from memory|
|MSTORE|0|2|0| | |0x52|3|Save word to memory|
|MSTORE8|0|2|0| | |0x53|3|Save byte to memory|
|SLOAD|0|1|1| | |0x54|50|Load word from storage|
|SSTORE|0|2|0| | |0x55|0|Save word to storage|
|JUMP|0|1|0| | |0x56|8|Alter the program counter|
|JUMPI|0|2|0| | |0x57|10|Conditionally alter the program counter|
|GETPC|0|0|1| | |0x58|2|Get the program counter|
|MSIZE|0|0|1| | |0x59|2|Get the size of active memory|
|GAS|0|0|1| | |0x5a|2|Get the amount of available gas|
|JUMPDEST|0|0|0| | |0x5b|1|Set a potential jump destination|
|PUSH|1|0|1| | |0x60|0|Place 1 byte item on stack|
|PUSH|2|0|1| | |0x61|0|Place 2 byte item on stack|
|PUSH|3|0|1| | |0x62|0|Place 3 byte item on stack|
|PUSH|4|0|1| | |0x63|0|Place 4 byte item on stack|
|PUSH|5|0|1| | |0x64|0|Place 5 byte item on stack|
|PUSH|6|0|1| | |0x65|0|Place 6 byte item on stack|
|PUSH|7|0|1| | |0x66|0|Place 7 byte item on stack|
|PUSH|8|0|1| | |0x67|0|Place 8 byte item on stack|
|PUSH|9|0|1| | |0x68|0|Place 9 byte item on stack|
|PUSH|10|0|1| | |0x69|0|Place 10 byte item on stack|
|PUSH|11|0|1| | |0x6a|0|Place 11 byte item on stack|
|PUSH|12|0|1| | |0x6b|0|Place 12 byte item on stack|
|PUSH|13|0|1| | |0x6c|0|Place 13 byte item on stack|
|PUSH|14|0|1| | |0x6d|0|Place 14 byte item on stack|
|PUSH|15|0|1| | |0x6e|0|Place 15 byte item on stack|
|PUSH|16|0|1| | |0x6f|0|Place 16 byte item on stack|
|PUSH|17|0|1| | |0x70|0|Place 17 byte item on stack|
|PUSH|18|0|1| | |0x71|0|Place 18 byte item on stack|
|PUSH|19|0|1| | |0x72|0|Place 19 byte item on stack|
|PUSH|20|0|1| | |0x73|0|Place 20 byte item on stack|
|PUSH|21|0|1| | |0x74|0|Place 21 byte item on stack|
|PUSH|22|0|1| | |0x75|0|Place 22 byte item on stack|
|PUSH|23|0|1| | |0x76|0|Place 23 byte item on stack|
|PUSH|24|0|1| | |0x77|0|Place 24 byte item on stack|
|PUSH|25|0|1| | |0x78|0|Place 25 byte item on stack|
|PUSH|26|0|1| | |0x79|0|Place 26 byte item on stack|
|PUSH|27|0|1| | |0x7a|0|Place 27 byte item on stack|
|PUSH|28|0|1| | |0x7b|0|Place 28 byte item on stack|
|PUSH|29|0|1| | |0x7c|0|Place 29 byte item on stack|
|PUSH|30|0|1| | |0x7d|0|Place 30 byte item on stack|
|PUSH|31|0|1| | |0x7e|0|Place 31 byte item on stack|
|PUSH|32|0|1| | |0x7f|0|Place 32 byte item on stack|
|DUP|0|1|2| | |0x80|3|Copies the highest item in the stack to the top of the stack|
|DUP|0|2|3| | |0x81|3|Copies the second highest item in the stack to the top of the stack|
|DUP|0|3|4| | |0x82|3|Copies the third highest item in the stack to the top of the stack|
|DUP|0|4|5| | |0x83|3|Copies the 4th highest item in the stack to the top of the stack|
|DUP|0|5|6| | |0x84|3|Copies the 5th highest item in the stack to the top of the stack|
|DUP|0|6|7| | |0x85|3|Copies the 6th highest item in the stack to the top of the stack|
|DUP|0|7|8| | |0x86|3|Copies the 7th highest item in the stack to the top of the stack|
|DUP|0|8|9| | |0x87|3|Copies the 8th highest item in the stack to the top of the stack|
|DUP|0|9|10| | |0x88|3|Copies the 9th highest item in the stack to the top of the stack|
|DUP|0|10|11| | |0x89|3|Copies the 10th highest item in the stack to the top of the stack|
|DUP|0|11|12| | |0x8a|3|Copies the 11th highest item in the stack to the top of the stack|
|DUP|0|12|13| | |0x8b|3|Copies the 12th highest item in the stack to the top of the stack|
|DUP|0|13|14| | |0x8c|3|Copies the 13th highest item in the stack to the top of the stack|
|DUP|0|14|15| | |0x8d|3|Copies the 14th highest item in the stack to the top of the stack|
|DUP|0|15|16| | |0x8e|3|Copies the 15th highest item in the stack to the top of the stack|
|DUP|0|16|17| | |0x8f|3|Copies the 16th highest item in the stack to the top of the stack|
|SWAP|0|2|2| | |0x90|3|Swaps the highest and second highest value on the stack|
|SWAP|0|3|3| | |0x91|3|Swaps the highest and third highest value on the stack|
|SWAP|0|4|4| | |0x92|3|Swaps the highest and 4th highest value on the stack|
|SWAP|0|5|5| | |0x93|3|Swaps the highest and 5th highest value on the stack|
|SWAP|0|6|6| | |0x94|3|Swaps the highest and 6th highest value on the stack|
|SWAP|0|7|7| | |0x95|3|Swaps the highest and 7th highest value on the stack|
|SWAP|0|8|8| | |0x96|3|Swaps the highest and 8th highest value on the stack|
|SWAP|0|9|9| | |0x97|3|Swaps the highest and 9th highest value on the stack|
|SWAP|0|10|10| | |0x98|3|Swaps the highest and 10th highest value on the stack|
|SWAP|0|11|11| | |0x99|3|Swaps the highest and 11th highest value on the stack|
|SWAP|0|12|12| | |0x9a|3|Swaps the highest and 12th highest value on the stack|
|SWAP|0|13|13| | |0x9b|3|Swaps the highest and 13th highest value on the stack|
|SWAP|0|14|14| | |0x9c|3|Swaps the highest and 14th highest value on the stack|
|SWAP|0|15|15| | |0x9d|3|Swaps the highest and 15th highest value on the stack|
|SWAP|0|16|16| | |0x9e|3|Swaps the highest and 16th highest value on the stack|
|SWAP|0|17|17| | |0x9f|3|Swaps the highest and 17th highest value on the stack|
|LOG|0|2|0| | |0xa0|375|Makes a log entry; no topics.|
|LOG|0|3|0| | |0xa1|750|Makes a log entry; 1 topic.|
|LOG|0|4|0| | |0xa2|1125|Makes a log entry; 2 topics.|
|LOG|0|5|0| | |0xa3|1500|Makes a log entry; 3 topics.|
|LOG|0|6|0| | |0xa4|1875|Makes a log entry; 4 topics.|
|JUMPTO| | | | | |0xb0| |Alter the program counter to a jumpdest -- not part of Instructions.cpp|
|JUMPIF| | | | | |0xb1| |Conditionally alter the program counter -- not part of Instructions.cpp|
|JUMPV| | | | | |0xb2| |Alter the program counter to a jumpdest -- not part of Instructions.cpp|
|JUMPSUB| | | | | |0xb3| |Alter the program counter to a beginsub -- not part of Instructions.cpp|
|JUMPSUBV| | | | | |0xb4| |Alter the program counter to a beginsub -- not part of Instructions.cpp|
|BEGINSUB| | | | | |0xb5| |Set a potential jumpsub destination -- not part of Instructions.cpp|
|BEGINDATA| | | | | |0xb6| |Begin the data section -- not part of Instructions.cpp|
|RETURNSUB| | | | | |0xb7| |Return to subroutine jumped from -- not part of Instructions.cpp|
|PUTLOCAL| | | | | |0xb8| |Pop top of stack to local variable -- not part of Instructions.cpp|
|GETLOCAL| | | | | |0xb9| |Push local variable to top of stack -- not part of Instructions.cpp|
|CREATE|0|3|1| | |0xf0|32000|Create a new account with associated code|
|CALL|0|7|1| | |0xf1|40|Message-call into an account|
|CALLCODE|0|7|1| | |0xf2|40|Message-call with another account's code only|
|RETURN|0|2|0| | |0xf3|0|Halt execution returning output data|
|DELEGATECALL|0|6|1| | |0xf4|40|Like CALLCODE but keeps caller's value and sender|
|STATICCALL|0|6|1| | |0xfa|40|Like CALL but disallow state modifications|
|CREATE2| | | | | |0xfb| |Create new account with associated code at address `sha3(sender + salt + sha3(init code)) % 2**160`|
|REVERT|0|2|0| | |0xfd|0|Halt execution, revert state and return output data|
|INVALID|0|0|0| | |0xfe|0|Invalid instruction for expressing runtime errors (e.g., division-by-zero)|
|SELFDESTRUCT|0|1|0| | |0xff|5000|Halt execution and register account for later deletion.|

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
