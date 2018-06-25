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

* Solidity: [solidity/libevmasm/Instruction.cpp](https://github.com/ethereum/solidity/blob/0edce4b570c157927933697b30f0f94cbdf173b2/libevmasm/Instruction.cpp)
* Solidity comments: [solidity/libevmasm/Instruction.h](https://github.com/ethereum/solidity/blob/8999a2f375410a29bae46b8e87a70c62036c880d/libevmasm/Instruction.h#L38)

* Ethereum: [cpp-ethereum/libevm/Instruction.cpp](https://github.com/ethereum/cpp-ethereum/blob/70d52b8f384126c75ae1830b6364616fc2eb1da1/libevm/Instruction.cpp)
* Ethereum comments: [cpp-ethereum/libevm/Instruction.h](https://github.com/ethereum/cpp-ethereum/blob/70d52b8f384126c75ae1830b6364616fc2eb1da1/libevm/Instruction.h)

* Manticore: [trailofbits/manticore](https://github.com/trailofbits/manticore/blob/cf6cd0eaf2bd4f38b16c6ee2027e1c219e5eafe8/manticore/platforms/evm.py#L412)
* Gas costs: [evm-opcode-gas-costs](https://github.com/djrtwo/evm-opcode-gas-costs/blob/d76683b33b6fffb7bf7af8706d9f6f63db3af182/opcode-gas-costs_EIP-150_revision-1e18248_2017-04-12.csv)
* Opcodes and Instruction Reference: [Ethereum VM (EVM) Opcodes and Instruction Reference](https://github.com/trailofbits/evm-opcodes/blob/8d467f1a319f20737991f43aff9e0b1489a09899/README.md)

* Assembly: [solidity/docs/assembly.rst](https://github.com/ethereum/solidity/blob/develop/docs/assembly.rst)

* [solidity/libevmasm/AssemblyItem.cpp](https://github.com/ethereum/solidity/blob/8999a2f375410a29bae46b8e87a70c62036c880d/libevmasm/AssemblyItem.cpp#L60)
* [solidity/libevmasm/SemanticInformation.cpp](https://github.com/ethereum/solidity/blob/8999a2f375410a29bae46b8e87a70c62036c880d/libevmasm/SemanticInformation.cpp#L31)

## Parse sequence

Здесь описана последовательность, в которой происходит парсинг исходников и описывается, почему он именно такой

0. Solidity - получаем текущий список используемых опкодов и их количество `pops` и `pushes`
0. Solidity comments - получаем `description` для предыдущего шага. Если встречаем новый опкод, то скипаем его. Он будет добавлен дальше
0. Ethereum comments - все опкоды которые добавляться здесь являются `tentative`, так же этот файл содержит хексы, так что мы можем найти дупликаты с разными мнемониками
0. Ethereum - получаем количество `pops` и `pushes` для предыдущего шага
0. Manticore - получаем `additional_items`, `gas` и `description` для тех опкодов, у которых их еще нет
0. Gas costs - получаем `gas_function`
0. Opcodes and Instruction Reference - получаем ссылки на `EIP`'s
0. Assembly list - получаем `assembly` представление и данные о нем

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

|Hex|Mnemonic|Assembly|Pops|Pushes|Tier|Description|Gas|Additional items|Side effects|Assembly description|Assembly since|Gas formula|Link|Tentative|Internal|
|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
|0x00|STOP|stop|0|0|Zero|Halts execution|0|0|true|Stop execution, identical to return(0,0)|Frontier| | | | |
|0x01|ADD|add(x, y)|2|1|VeryLow|Addition operation|3|0|false|X + y|Frontier| | | | |
|0x02|MUL|mul(x, y)|2|1|Low|Multiplication operation|5|0|false|X * y|Frontier| | | | |
|0x03|SUB|sub(x, y)|2|1|VeryLow|Subtraction operation|3|0|false|X - y|Frontier| | | | |
|0x04|DIV|div(x, y)|2|1|Low|Integer division operation|5|0|false|X / y|Frontier| | | | |
|0x05|SDIV|sdiv(x, y)|2|1|Low|Signed integer division operation|5|0|false|X / y, for signed numbers in two's complement|Frontier| | | | |
|0x06|MOD|mod(x, y)|2|1|Low|Modulo remainder operation|5|0|false|X % y|Frontier| | | | |
|0x07|SMOD|smod(x, y)|2|1|Low|Signed modulo remainder operation|5|0|false|X % y, for signed numbers in two's complement|Frontier| | | | |
|0x08|ADDMOD|addmod(x, y, m)|3|1|Mid|Unsigned modular addition|8|0|false|(x + y) % m with arbitrary precision arithmetics|Frontier| | | | |
|0x09|MULMOD|mulmod(x, y, m)|3|1|Mid|Unsigned modular multiplication|8|0|false|(x * y) % m with arbitrary precision arithmetics|Frontier| | | | |
|0x0a|EXP|exp(x, y)|2|1|Special|Exponential operation|10|0|false|X to the power of y|Frontier|(exp == 0) ? 10 : (10 + 10 * (1 + log256(exp)))| | | |
|0x0b|SIGNEXTEND|signextend(i, x)|2|1|Low|Extend length of signed integer|5|0|false|Sign extend from (i*8+7)th bit counting from least significant|Frontier| | | | |
|0x10|LT|lt(x, y)|2|1|VeryLow|Less-than comparison|3|0|false|1 if x < y, 0 otherwise|Frontier| | | | |
|0x11|GT|gt(x, y)|2|1|VeryLow|Greater-than comparison|3|0|false|1 if x > y, 0 otherwise|Frontier| | | | |
|0x12|SLT|slt(x, y)|2|1|VeryLow|Signed less-than comparison|3|0|false|1 if x < y, 0 otherwise, for signed numbers in two's complement|Frontier| | | | |
|0x13|SGT|sgt(x, y)|2|1|VeryLow|Signed greater-than comparison|3|0|false|1 if x > y, 0 otherwise, for signed numbers in two's complement|Frontier| | | | |
|0x14|EQ|eq(x, y)|2|1|VeryLow|Equality comparison|3|0|false|1 if x == y, 0 otherwise|Frontier| | | | |
|0x15|ISZERO|iszero(x)|1|1|VeryLow|Simple not operator|3|0|false|1 if x == 0, 0 otherwise|Frontier| | | | |
|0x16|AND|and(x, y)|2|1|VeryLow|Bitwise AND operation|3|0|false|Bitwise and of x and y|Frontier| | | | |
|0x17|OR|or(x, y)|2|1|VeryLow|Bitwise OR operation|3|0|false|Bitwise or of x and y|Frontier| | | | |
|0x18|XOR|xor(x, y)|2|1|VeryLow|Bitwise XOR operation|3|0|false|Bitwise xor of x and y|Frontier| | | | |
|0x19|NOT|not(x)|1|1|VeryLow|Bitwise NOT operation|3|0|false|~x, every bit of x is negated|Frontier| | | | |
|0x1a|BYTE|byte(n, x)|2|1|VeryLow|Retrieve single byte from word|3|0|false|Nth byte of x, where the most significant byte is the 0th byte|Frontier| | | | |
|0x1b|SHL|shl(x, y)|2|1|VeryLow|Bitwise SHL operation| |0|false|Logical shift left y by x bits|Constantinople| | | | |
|0x1c|SHR|shr(x, y)|2|1|VeryLow|Bitwise SHR operation| |0|false|Logical shift right y by x bits|Constantinople| | | | |
|0x1d|SAR|sar(x, y)|2|1|VeryLow|Bitwise SAR operation| |0|false|Arithmetic shift right y by x bits|Constantinople| | | | |
|0x20|KECCAK256 &#124; SHA3|keccak256(p, n)|2|1|Special|Compute KECCAK-256 hash|30|0|true|Keccak(mem[p...(p+n)))|Frontier|30 + 6 * (size of input in words)| | | |
|0x30|ADDRESS|address|0|1|Base|Get address of currently executing account|2|0|false|Address of the current contract / execution context|Frontier| | | | |
|0x31|BALANCE|balance(a)|1|1|Balance|Get balance of the given account|20|0|false|Wei balance at address a|Frontier| | | | |
|0x32|ORIGIN|origin|0|1|Base|Get execution origination address|2|0|false|Transaction sender|Frontier| | | | |
|0x33|CALLER|caller|0|1|Base|Get caller address|2|0|false|Call sender (excluding `delegatecall`)|Frontier| | | | |
|0x34|CALLVALUE|callvalue|0|1|Base|Get deposited value by the instruction/transaction responsible for this execution|2|0|false|Wei sent together with the current call|Frontier| | | | |
|0x35|CALLDATALOAD|calldataload(p)|1|1|VeryLow|Get input data of current environment|3|0|false|Call data starting from position p (32 bytes)|Frontier| | | | |
|0x36|CALLDATASIZE|calldatasize|0|1|Base|Get size of input data in current environment|2|0|false|Size of call data in bytes|Frontier| | | | |
|0x37|CALLDATACOPY|calldatacopy(t, f, s)|3|0|VeryLow|Copy input data in current environment to memory|3|0|true|Copy s bytes from calldata at position f to mem at position t|Frontier|2 + 3 * (number of words copied, rounded up)| | | |
|0x38|CODESIZE|codesize|0|1|Base|Get size of code running in current environment|2|0|false|Size of the code of the current contract / execution context|Frontier| | | | |
|0x39|CODECOPY|codecopy(t, f, s)|3|0|VeryLow|Copy code running in current environment to memory|3|0|true|Copy s bytes from code at position f to mem at position t|Frontier|2 + 3 * (number of words copied, rounded up)| | | |
|0x3a|GASPRICE|gasprice|0|1|Base|Get price of gas in current environment|2|0|false|Gas price of the transaction|Frontier| | | | |
|0x3b|EXTCODESIZE|extcodesize(a)|1|1|ExtCode|Get external code size (from another contract)|20|0|false|Size of the code at address a|Frontier| | | | |
|0x3c|EXTCODECOPY|extcodecopy(a, t, f, s)|4|0|ExtCode|Copy external code (from another contract)|20|0|true|Like codecopy(t, f, s) but take code at address a|Frontier|700 + 3 * (number of words copied, rounded up)| | | |
|0x3d|RETURNDATASIZE|returndatasize|0|1|Base|Get size of return data buffer|2|0|false|Size of the last returndata|Byzantium| |[EIP 211](https://github.com/ethereum/EIPs/blob/33907618abf4bc2512b509a88c037ae36d20394c/EIPS/eip-211.md)| | |
|0x3e|RETURNDATACOPY|returndatacopy(t, f, s)|3|0|VeryLow|Copy return data in current environment to memory|3|0|true|Copy s bytes from returndata at position f to mem at position t|Byzantium| |[EIP 211](https://github.com/ethereum/EIPs/blob/33907618abf4bc2512b509a88c037ae36d20394c/EIPS/eip-211.md)| | |
|0x40|BLOCKHASH|blockhash(b)|1|1|Ext|Get hash of most recent complete block|20|0|false|Hash of block nr b - only for last 256 blocks excluding current|Frontier| | | | |
|0x41|COINBASE|coinbase|0|1|Base|Get the block's coinbase address|2|0|false|Current mining beneficiary|Frontier| | | | |
|0x42|TIMESTAMP|timestamp|0|1|Base|Get the block's timestamp|2|0|false|Timestamp of the current block in seconds since the epoch|Frontier| | | | |
|0x43|NUMBER|number|0|1|Base|Get the block's number|2|0|false|Current block number|Frontier| | | | |
|0x44|DIFFICULTY|difficulty|0|1|Base|Get the block's difficulty|2|0|false|Difficulty of the current block|Frontier| | | | |
|0x45|GASLIMIT|gaslimit|0|1|Base|Get the block's gas limit|2|0|false|Block gas limit of the current block|Frontier| | | | |
|0x50|POP|pop(x)|1|0|Base|Remove item from stack|2|0|false|Remove the element pushed by x|Frontier| | | | |
|0x51|MLOAD|mload(p)|1|1|VeryLow|Load word from memory|3|0|true|Mem[p..(p+32))|Frontier| | | | |
|0x52|MSTORE|mstore(p, v)|2|0|VeryLow|Save word to memory|3|0|true|Mem[p..(p+32)) := v|Frontier| | | | |
|0x53|MSTORE8|mstore8(p, v)|2|0|VeryLow|Save byte to memory|3|0|true|Mem[p] := v & 0xff (only modifies a single byte)|Frontier| | | | |
|0x54|SLOAD|sload(p)|1|1|Special|Load word from storage|50|0|false|Storage[p]|Frontier| | | | |
|0x55|SSTORE|sstore(p, v)|2|0|Special|Save word to storage|0|0|true|Storage[p] := v|Frontier|((value != 0) && (storage_location == 0)) ? 20000 : 5000| | | |
|0x56|JUMP|jump(label)|1|0|Mid|Alter the program counter|8|0|true|Jump to label / code position|Frontier| | | | |
|0x57|JUMPI|jumpi(label, cond)|2|0|High|Conditionally alter the program counter|10|0|true|Jump to label if cond is nonzero|Frontier| | | | |
|0x58|PC|pc|0|1|Base|Get the program counter|2|0|false|Current position in code|Frontier| | | | |
|0x59|MSIZE|msize|0|1|Base|Get the size of active memory|2|0|false|Size of memory, i.e. largest accessed memory index|Frontier| | | | |
|0x5a|GAS|gas|0|1|Base|Get the amount of available gas|2|0|false|Gas still available to execution|Frontier| | | | |
|0x5b|JUMPDEST| |0|0|Special|Set a potential jump destination|1|0|true| | | | | | |
|0x60|PUSH1| |0|1|VeryLow|Place 1 byte item on stack|0|1|false| | | | | | |
|0x61|PUSH2| |0|1|VeryLow|Place 2 byte item on stack|0|2|false| | | | | | |
|0x62|PUSH3| |0|1|VeryLow|Place 3 byte item on stack|0|3|false| | | | | | |
|0x63|PUSH4| |0|1|VeryLow|Place 4 byte item on stack|0|4|false| | | | | | |
|0x64|PUSH5| |0|1|VeryLow|Place 5 byte item on stack|0|5|false| | | | | | |
|0x65|PUSH6| |0|1|VeryLow|Place 6 byte item on stack|0|6|false| | | | | | |
|0x66|PUSH7| |0|1|VeryLow|Place 7 byte item on stack|0|7|false| | | | | | |
|0x67|PUSH8| |0|1|VeryLow|Place 8 byte item on stack|0|8|false| | | | | | |
|0x68|PUSH9| |0|1|VeryLow|Place 9 byte item on stack|0|9|false| | | | | | |
|0x69|PUSH10| |0|1|VeryLow|Place 10 byte item on stack|0|10|false| | | | | | |
|0x6a|PUSH11| |0|1|VeryLow|Place 11 byte item on stack|0|11|false| | | | | | |
|0x6b|PUSH12| |0|1|VeryLow|Place 12 byte item on stack|0|12|false| | | | | | |
|0x6c|PUSH13| |0|1|VeryLow|Place 13 byte item on stack|0|13|false| | | | | | |
|0x6d|PUSH14| |0|1|VeryLow|Place 14 byte item on stack|0|14|false| | | | | | |
|0x6e|PUSH15| |0|1|VeryLow|Place 15 byte item on stack|0|15|false| | | | | | |
|0x6f|PUSH16| |0|1|VeryLow|Place 16 byte item on stack|0|16|false| | | | | | |
|0x70|PUSH17| |0|1|VeryLow|Place 17 byte item on stack|0|17|false| | | | | | |
|0x71|PUSH18| |0|1|VeryLow|Place 18 byte item on stack|0|18|false| | | | | | |
|0x72|PUSH19| |0|1|VeryLow|Place 19 byte item on stack|0|19|false| | | | | | |
|0x73|PUSH20| |0|1|VeryLow|Place 20 byte item on stack|0|20|false| | | | | | |
|0x74|PUSH21| |0|1|VeryLow|Place 21 byte item on stack|0|21|false| | | | | | |
|0x75|PUSH22| |0|1|VeryLow|Place 22 byte item on stack|0|22|false| | | | | | |
|0x76|PUSH23| |0|1|VeryLow|Place 23 byte item on stack|0|23|false| | | | | | |
|0x77|PUSH24| |0|1|VeryLow|Place 24 byte item on stack|0|24|false| | | | | | |
|0x78|PUSH25| |0|1|VeryLow|Place 25 byte item on stack|0|25|false| | | | | | |
|0x79|PUSH26| |0|1|VeryLow|Place 26 byte item on stack|0|26|false| | | | | | |
|0x7a|PUSH27| |0|1|VeryLow|Place 27 byte item on stack|0|27|false| | | | | | |
|0x7b|PUSH28| |0|1|VeryLow|Place 28 byte item on stack|0|28|false| | | | | | |
|0x7c|PUSH29| |0|1|VeryLow|Place 29 byte item on stack|0|29|false| | | | | | |
|0x7d|PUSH30| |0|1|VeryLow|Place 30 byte item on stack|0|30|false| | | | | | |
|0x7e|PUSH31| |0|1|VeryLow|Place 31 byte item on stack|0|31|false| | | | | | |
|0x7f|PUSH32| |0|1|VeryLow|Place 32 byte item on stack|0|32|false| | | | | | |
|0x80|DUP1|dup1|1|2|VeryLow|Copies the highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x81|DUP2|dup2|2|3|VeryLow|Copies the second highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x82|DUP3|dup3|3|4|VeryLow|Copies the third highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x83|DUP4|dup4|4|5|VeryLow|Copies the 4th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x84|DUP5|dup5|5|6|VeryLow|Copies the 5th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x85|DUP6|dup6|6|7|VeryLow|Copies the 6th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x86|DUP7|dup7|7|8|VeryLow|Copies the 7th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x87|DUP8|dup8|8|9|VeryLow|Copies the 8th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x88|DUP9|dup9|9|10|VeryLow|Copies the 9th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x89|DUP10|dup10|10|11|VeryLow|Copies the 10th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x8a|DUP11|dup11|11|12|VeryLow|Copies the 11th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x8b|DUP12|dup12|12|13|VeryLow|Copies the 12th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x8c|DUP13|dup13|13|14|VeryLow|Copies the 13th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x8d|DUP14|dup14|14|15|VeryLow|Copies the 14th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x8e|DUP15|dup15|15|16|VeryLow|Copies the 15th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x8f|DUP16|dup16|16|17|VeryLow|Copies the 16th highest item in the stack to the top of the stack|3|0|false|Copy ith stack slot to the top (counting from top)|Frontier| | | | |
|0x90|SWAP1|swap1|2|2|VeryLow|Swaps the highest and second highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x91|SWAP2|swap2|3|3|VeryLow|Swaps the highest and third highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x92|SWAP3|swap3|4|4|VeryLow|Swaps the highest and 4th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x93|SWAP4|swap4|5|5|VeryLow|Swaps the highest and 5th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x94|SWAP5|swap5|6|6|VeryLow|Swaps the highest and 6th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x95|SWAP6|swap6|7|7|VeryLow|Swaps the highest and 7th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x96|SWAP7|swap7|8|8|VeryLow|Swaps the highest and 8th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x97|SWAP8|swap8|9|9|VeryLow|Swaps the highest and 9th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x98|SWAP9|swap9|10|10|VeryLow|Swaps the highest and 10th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x99|SWAP10|swap10|11|11|VeryLow|Swaps the highest and 11th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x9a|SWAP11|swap11|12|12|VeryLow|Swaps the highest and 12th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x9b|SWAP12|swap12|13|13|VeryLow|Swaps the highest and 13th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x9c|SWAP13|swap13|14|14|VeryLow|Swaps the highest and 14th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x9d|SWAP14|swap14|15|15|VeryLow|Swaps the highest and 15th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x9e|SWAP15|swap15|16|16|VeryLow|Swaps the highest and 16th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0x9f|SWAP16|swap16|17|17|VeryLow|Swaps the highest and 17th highest value on the stack|3|0|false|Swap topmost and ith stack slot below it|Frontier| | | | |
|0xa0|LOG0|log0(p, s)|2|0|Special|Makes a log entry; no topics.|375|0|true|Log without topics and data mem[p..(p+s))|Frontier|375 + 8 * (number of bytes in log data)| | | |
|0xa1|LOG1|log1(p, s, t1)|3|0|Special|Makes a log entry; 1 topic.|750|0|true|Log with topic t1 and data mem[p..(p+s))|Frontier|375 + 8 * (number of bytes in log data) + 375| | | |
|0xa2|LOG2|log2(p, s, t1, t2)|4|0|Special|Makes a log entry; 2 topics.|1125|0|true|Log with topics t1, t2 and data mem[p..(p+s))|Frontier|375 + 8 * (number of bytes in log data) + 2 * 375| | | |
|0xa3|LOG3|log3(p, s, t1, t2, t3)|5|0|Special|Makes a log entry; 3 topics.|1500|0|true|Log with topics t1, t2, t3 and data mem[p..(p+s))|Frontier|375 + 8 * (number of bytes in log data) + 3 * 375| | | |
|0xa4|LOG4|log4(p, s, t1, t2, t3, t4)|6|0|Special|Makes a log entry; 4 topics.|1875|0|true|Log with topics t1, t2, t3, t4 and data mem[p..(p+s))|Frontier|375 + 8 * (number of bytes in log data) + 4 * 375| | | |
|0xac|PUSHC| |0|1|VeryLow|Push value from constant pool| | | | | | | |true|true|
|0xad|JUMPC| |1|0|Mid|Alter the program counter - pre-verified| | | | | | | |true|true|
|0xae|JUMPCI| |2|0|High|Conditionally alter the program counter - pre-verified| | | | | | | |true|true|
|0xb0|JUMPTO| |1|0|VeryLow|Alter the program counter to a jumpdest| | | | | | |[EIP 615](https://github.com/ethereum/EIPs/blob/33907618abf4bc2512b509a88c037ae36d20394c/EIPS/eip-615.md)|true| |
|0xb1|JUMPIF| |2|0|Low|Conditionally alter the program counter| | | | | | |[EIP 615](https://github.com/ethereum/EIPs/blob/33907618abf4bc2512b509a88c037ae36d20394c/EIPS/eip-615.md)|true| |
|0xb2|JUMPSUB| |1|0|Low|Alter the program counter to a beginsub| | | | | | |[EIP 615](https://github.com/ethereum/EIPs/blob/33907618abf4bc2512b509a88c037ae36d20394c/EIPS/eip-615.md)|true| |
|0xb3|JUMPV| |1|0|Mid|Alter the program counter to a jumpdest| | | | | | | |true| |
|0xb4|JUMPSUBV| |1|0|Mid|Alter the program counter to a beginsub| | | | | | |[EIP 615](https://github.com/ethereum/EIPs/blob/33907618abf4bc2512b509a88c037ae36d20394c/EIPS/eip-615.md)|true| |
|0xb5|BEGINSUB| |0|0|Special|Set a potential jumpsub destination| | | | | | |[EIP 615](https://github.com/ethereum/EIPs/blob/33907618abf4bc2512b509a88c037ae36d20394c/EIPS/eip-615.md)|true| |
|0xb6|BEGINDATA| |0|0|Special|Begine the data section| | | | | | |[EIP 615](https://github.com/ethereum/EIPs/blob/33907618abf4bc2512b509a88c037ae36d20394c/EIPS/eip-615.md)|true| |
|0xb7|RETURNSUB| |1|0|Mid|Return to subroutine jumped from| | | | | | | |true| |
|0xb8|PUTLOCAL| |1|0|VeryLow|Pop top of stack to local variable| | | | | | |[EIP 615](https://github.com/ethereum/EIPs/blob/33907618abf4bc2512b509a88c037ae36d20394c/EIPS/eip-615.md)|true| |
|0xb9|GETLOCAL| |0|1|VeryLow|Push local variable to top of stack| | | | | | |[EIP 615](https://github.com/ethereum/EIPs/blob/33907618abf4bc2512b509a88c037ae36d20394c/EIPS/eip-615.md)|true| |
|0xc1|XADD| |0|0|Special|Addition operation| | | | | | | |true| |
|0xc2|XMUL| |2|1|Special|Mulitplication operation| | | | | | | |true| |
|0xc3|XSUB| |2|1|Special|Subtraction operation| | | | | | | |true| |
|0xc4|XDIV| |2|1|Special|Integer division operation| | | | | | | |true| |
|0xc5|XSDIV| |2|1|Special|Signed integer division operation| | | | | | | |true| |
|0xc6|XMOD| |2|1|Special|Modulo remainder operation| | | | | | | |true| |
|0xc7|XSMOD| |2|1|Special|Signed modulo remainder operation| | | | | | | |true| |
|0xd0|XLT| |2|1|Special|Less-than comparision| | | | | | | |true| |
|0xd1|XGT| |2|1|Special|Greater-than comparision| | | | | | | |true| |
|0xd2|XSLT| |2|1|Special|Signed less-than comparision| | | | | | | |true| |
|0xd3|XSGT| |2|1|Special|Signed greater-than comparision| | | | | | | |true| |
|0xd4|XEQ| |2|1|Special|Equality comparision| | | | | | | |true| |
|0xd5|XISZERO| |2|1|Special|Simple not operator| | | | | | | |true| |
|0xd6|XAND| |1|1|Special|Bitwise AND operation| | | | | | | |true| |
|0xd7|XOOR| |2|1|Special|Bitwise OR operation| | | | | | | |true| |
|0xd8|XXOR| |2|1|Special|Bitwise XOR operation| | | | | | | |true| |
|0xd9|XNOT| |2|1|Special|Bitwise NOT opertation| | | | | | | |true| |
|0xdb|XSHL| |2|1|Special|Shift left opertation| | | | | | | |true| |
|0xdc|XSHR| |2|1|Special|Shift right opertation| | | | | | | |true| |
|0xdd|XSAR| |2|1|Special|Shift arithmetic right opertation| | | | | | | |true| |
|0xde|XROL| |2|1|Special|Rotate left opertation| | | | | | | |true| |
|0xdf|XROR| |2|1|Special|Rotate right opertation| | | | | | | |true| |
|0xe0|XPUSH| |1|1|VeryLow|Push vector to stack| | | | | | | |true| |
|0xe1|XMLOAD| |1|1|VeryLow|Load vector from memory| | | | | | | |true| |
|0xe2|XMSTORE| |2|0|VeryLow|Save vector to memory| | | | | | | |true| |
|0xe4|XSLOAD| |1|1|Special|Load vector from storage| | | | | | | |true| |
|0xe5|XSSTORE| |2|0|Special|Save vector to storage| | | | | | | |true| |
|0xe6|XVTOWIDE| |1|1|VeryLow|Convert vector to wide integer| | | | | | | |true| |
|0xe7|XWIDETOV| |1|1|VeryLow|Convert wide integer to vector| | | | | | | |true| |
|0xe8|XGET| |2|1|Special|Get data from vector| | | | | | | |true| |
|0xe9|XPUT| |3|1|Special|Put data in vector| | | | | | | |true| |
|0xea|XSWIZZLE| |2|1|Special|Permute data in vector| | | | | | | |true| |
|0xeb|XSHUFFLE| |3|1|Special|Permute data in two vectors| | | | | | | |true| |
|0xf0|CREATE|create(v, p, s)|3|1|Special|Create a new account with associated code|32000|0|true|Create new contract with code mem[p..(p+s)) and send v wei and return the new address|Frontier| | | | |
|0xf1|CALL|call(g, a, v, in, insize, out, outsize)|7|1|Special|Message-call into an account|40|0|true|Call contract at address a with input mem[in..(in+insize)) providing g gas and v wei and output area mem[out..(out+outsize)) returning 0 on error (eg. out of gas) and 1 on success|Frontier|Complex -- see yellow paper  Appendix H| | | |
|0xf2|CALLCODE|callcode(g, a, v, in, insize, out, outsize)|7|1|Special|Message-call with another account's code only|40|0|true|Identical to `call` but only use the code from a and stay in the context of the current contract otherwise|Frontier|Complex -- see yellow paper  Appendix H| | | |
|0xf3|RETURN|return(p, s)|2|0|Zero|Halt execution returning output data|0|0|true|End execution, return data mem[p..(p+s))|Frontier| | | | |
|0xf4|DELEGATECALL|delegatecall(g, a, in, insize, out, outsize)|6|1|Special|Like CALLCODE but keeps caller's value and sender|40|0|true|Identical to `callcode` but also keep `caller` and `callvalue`|Homestead|Complex -- see yellow paper  Appendix H| | | |
|0xfa|STATICCALL|staticcall(g, a, in, insize, out, outsize)|6|1|Special|Like CALL but disallow state modifications|40|0|true|Identical to `call(g, a, 0, in, insize, out, outsize)` but do not allow state modifications|Byzantium| | | | |
|0xfb|CREATE2|create2(v, n, p, s)|4|1|Special|Create new account with associated code at address `sha3(sender + salt + sha3(init code)) % 2**160`| |0|true|Create new contract with code mem[p..(p+s)) at address keccak256(<address> . n . keccak256(mem[p..(p+s))) and send v wei and return the new address|Constantinople| | | | |
|0xfd|REVERT|revert(p, s)|2|0|Zero|Halt execution, revert state and return output data|0|0|true|End execution, revert state changes, return data mem[p..(p+s))|Byzantium| | | | |
|0xfe|INVALID|invalid|0|0|Zero|Invalid instruction for expressing runtime errors (e.g., division-by-zero)|0|0|true|End execution with invalid instruction|Frontier|N/A| | | |
|0xff|SELFDESTRUCT &#124; SUICIDE|selfdestruct(a)|1|0|Special|Halt execution and register account for later deletion|5000|0|true|End execution, destroy current contract and send funds to a|Frontier|5000 + ((create_new_account) ? 25000 : 0)| | | |

## Table Legend

Объяснения некоторых моментов, которые могут быть неочевидны:

* [side_effects](https://github.com/ethereum/solidity/blob/8999a2f375410a29bae46b8e87a70c62036c880d/libevmasm/Instruction.h#L289) - false if the only effect on the execution environment (apart from gas usage) is a change to a topmost segment of the stack
* [additional_items](https://github.com/ethereum/solidity/blob/8999a2f375410a29bae46b8e87a70c62036c880d/libevmasm/Instruction.h#L286) - additional items required in memory for this instructions (only for PUSH)
* [tentative](https://github.com/igarnier/ocaml-geth/blob/cc1601900f11216c48f6b6f47d187d2ca0b855d0/lib/evm.ml#L133) - instructions that EVM can handle (because they are in EIPs) but Solidity don't use them
* [internal](https://github.com/ethereum/cpp-ethereum/blob/70d52b8f384126c75ae1830b6364616fc2eb1da1/libevm/Instruction.cpp#L213) - these are generated by the interpreter - should never be in user code
* assembly_description - sometimes assembly variant has different description from the opcode, then this colun will contain it
* assembly_since - from what version of Ethereum did this assembly appear
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
* Комьюнити до сих пор не определилось с мнемониками для некоторых опкодов (можно увидеть у 0xff и 0x20)
* К счастью (к счастью ли?), EVM все еще экспериментален и имеет много "свободного места" для новых опкодов, так что можно ожидать решения некоторых проблем в будущем
* Кто в лес, кто по дрова: есть 3 общепризнанных реализации EVM (помимо еще 2-3 самописных),
каждая реализация на своем языке, это с учетом того, что EVM и Solidity все еще в экспериментальной стадии.
* Забавный факт. В ходе этого этого исследования был найден баг средней тяжести в исходниках EVM на С++.
Баг в том, что команда XOOR была описана как XOR и в итоге для XOOR фактически не было описания,
a т.к. XOOR описывается позднее XOR, то это могло(и должно) перезаписать стандартное поведение XOR: https://github.com/ethereum/cpp-ethereum/issues/5094
* Обращаться к памяти ОЧЕНЬ дорого, дешевле что-то 1000 раз что-то умновить в стэке
* Можно легко "вылезти" за пределы `GAS_LIMIT` сделав пару обращений к памяти или возведений в степень (хотя об этом больше будет сказано в основном репорте).

## Instruction Details

### ADD

Takes two words from stack, adds them, then pushes the result onto the stack.

Pseudocode: `push(s[0]+s[1])`

### PUSHX

The following X bytes are read from PC, placed into a word, then this word is pushed onto the stack.

### MEM[A...B)

In the following, `mem[a...b)` signifies the bytes of memory starting at position a up to (excluding) position b and storage[p] signifies the storage contents at position p.

### PUSHI/JUMPDEST

The opcodes `pushi` and `jumpdest` cannot be used directly. (this is stated by Solidity docs)

### Yellow Paper

All opcodes, descriptions and gas costs for them can be found in official [YellowPaper](https://ethereum.github.io/yellowpaper/paper.pdf)
