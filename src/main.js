'use strict';

const URL = 'https://jsonplaceholder.typicode.com'

class UsersApi {
	#URL = URL
	#USER_URL = ''
	#users
	#user

	constructor( userUrl ) {
		this.#URL += this.#USER_URL = userUrl
		this.#users = []
		this.#user = null
	}

	async getUsers() {
		const rawUsers = await fetch( this.#URL, { method: "GET" } )
		this.#users = await rawUsers.json()
		this.saveToLocalstorage( this.#users )
		return this.#users
	}

	async getUserByID( id ) {
		const rawUser = await fetch( `${ this.#URL }/${ id }`, { method: "GET" } )
		this.#user = await rawUser.json()

		return this.#user
	}

	saveToLocalstorage( users ) {
		console.log( 'saveToLocalstorage' );

		const jsonUsers = JSON.stringify( users )
		localStorage.setItem( 'usersList', jsonUsers )
	}

	getFromLocalstorage() {
		console.log( 'getFromLocalstorage' );

		const users = localStorage.getItem( 'usersList' )
		if ( users === null ) {
			return { msg: 'users list in localStorage is empty' }
		} else {
			this.#users = JSON.parse( users )
			return this.#users
		}
	}

	sortByName( name ) {
		name = name.toLowerCase()

		return this.#users.filter( user => user.name.toLowerCase().includes( name ) )
	}
}

class App {
	constructor( userInst ) {
		console.log( "constructor" );

		this.usersApi = userInst
		this.id = document.querySelector( '.id' );
		this.submitOne = document.querySelector( '.sub' );
		this.submitAll = document.querySelector( '.subAll' );
		this.sort = document.querySelector( '.sort' );
		this.rSide = document.querySelector( '.right_side' );


		this.getFromLocalStorage()
		this.eventInit()
	}

	getFromLocalStorage() {
		const users = this.usersApi.getFromLocalstorage()
		this.createCard( users )
	}

	eventInit() {
		console.log( 'listenerInit' );
		this.submitOne.addEventListener( 'click', this.handleSubmitOneClick.bind( this ) )
		this.submitAll.addEventListener( 'click', this.handleSubmitAllClick.bind( this ) )
		this.sort.addEventListener( 'input', this.handleSort.bind( this ) )
	}

	async handleSort( e ) {
		let { value } = e.target
		const users = this.usersApi.sortByName( value )
		this.clearRSide()
		this.createCard(users)
	}

	async handleSubmitOneClick( e ) {
		console.log( 'handleSubmitOneClick' );
		const userID = parseInt( this.id.value )
		const userByID = await this.usersApi.getUserByID( userID )

		this.createCard( [ userByID ] )
	}

	async handleSubmitAllClick() {
		console.log( 'handleSubmitAllClick' );
		const usersList = await this.usersApi.getUsers()

		this.createCard( usersList )
	}

	createCard( users = [] ) {
		console.log( 'createCard' );

		if ( Array.isArray( users ) ) {
			users.forEach( user => {
				const card = document.createElement( 'div' )
				const close = document.createElement( 'div' )
				const title = document.createElement( 'h2' )
				const text = document.createElement( 'p' )
				const email = document.createElement( 'p' )

				card.classList.add( 'card' )
				close.classList.add( 'close' )
				title.classList.add( 'card_title' )
				text.classList.add( 'card_text' )
				email.classList.add( 'card_email' )

				close.textContent = "+"
				title.textContent = user.name
				text.textContent = user.website
				email.textContent = user.email


				card.append( close )
				card.append( title )
				card.append( text )
				card.append( email )

				this.clearRSideEmptyP()
				this.render( card )
			} )
		} else {
			this.emptyRender( users )
		}
	}

	// Falsy значения - '', "", 0, false, NaN, undefined
	clearRSideEmptyP() {
		const pEpmty = document.querySelector( '.cardIsEmpty' )
		if ( pEpmty ) {
			pEpmty.remove()
		}
	}

	clearRSide() {
		this.rSide.innerHTML = ''
	}

	emptyRender( emptyUser = {} ) {
		const p = document.createElement( 'p' )
		p.classList.add( 'cardIsEmpty' )
		p.textContent = emptyUser.msg

		this.clearRSide()
		this.rSide.append( p )
	}

	render( cards ) {
		this.rSide.append( cards )
	}

}

const userApi = new UsersApi( '/users' )

const app = new App( userApi )
console.log( app );

