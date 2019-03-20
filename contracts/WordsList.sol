pragma solidity ^0.5.0;

contract WordsList {

	struct Word {
		string word;
		uint256 date;
	}

	uint public countWords = 0;

    mapping(uint => Word) public words;
    mapping(string => uint256) getAddressFromWord;

    event WordCreated(
    	uint id,
    	string word,
    	uint256 date,
    	uint256 length
    );

    function createWord(string memory _word) public {
    
		if(contains(_word) == 0 && bytes(_word).length > 0){
			Word memory data = Word(_word, now);
			countWords++;
			words[countWords] = data;
			getAddressFromWord[_word] = countWords;
			emit WordCreated(countWords, _word, data.date, bytes(_word).length);
		}

	}

	function contains(string memory _key) public view returns (uint256) {
        return bytes(words[getAddressFromWord[_key]].word).length;
    }
    
    function getByDate(string memory _key) public view returns (uint256) {
        return words[getAddressFromWord[_key]].date;
	}

}