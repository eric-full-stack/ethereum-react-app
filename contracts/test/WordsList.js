var WordsList = artifacts.require('./WordsList.sol')

contract('WordsList', (accounts) => {
	it('create word "teste"', () => {
		return WordsList.deployed().then((instance) => {
			token = instance
			
			return token.createWord("")
		}).then(word => {
			console.log(word)
		})
	})

	it('contains word "teste"', () => {
		return WordsList.deployed().then((instance) => {
			token = instance
			
			return token.contains("teste")
		}).then(contains => {
			console.log(contains)
		})
	})

	it('get word "teste"', () => {
		return WordsList.deployed().then((instance) => {
			token = instance
			
			return token.getByDate("teste")
		}).then(timestamp => {
			var date = new Date(timestamp.toNumber()*1000)	
			console.log(date)
		})
	})

	it('create word "teste2"', () => {
		return WordsList.deployed().then((instance) => {
			token = instance
			token.createWord("teste2")	
			return token.words(accounts[0])
		}).then(word => {
			console.log(word)
		})
	})

	it('contains word "teste2"', () => {
		return WordsList.deployed().then((instance) => {
			token = instance
			
			return token.contains("teste2")
		}).then(contains => {
			console.log(contains)
		})
	})

	it('get word "teste2"', () => {
		return WordsList.deployed().then((instance) => {
			token = instance
			
			return token.getByDate("teste2")
		}).then(timestamp => {
			var date = new Date(timestamp.toNumber()*1000)	
			console.log(date)
		})
	})

	it('contains word "teste"', () => {
		return WordsList.deployed().then((instance) => {
			token = instance
			
			return token.contains("teste")
		}).then(contains => {
			console.log(contains)
		})
	})

	it('create word "teste"', () => {
		return WordsList.deployed().then((instance) => {
			token = instance

			return token.createWord("teste")
		}).then(word => {
			console.log(word)
		})
	})

})